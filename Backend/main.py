from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form,
    HTTPException
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

import io
import cv2
import torch
import asyncio
import numpy as np
import onnxruntime as ort

from PIL import Image
from diffusers import AutoPipelineForText2Image

# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="AI Background API",
    version="1.0.0"
)

# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================================
# DEVICE
# =========================================================

device = "cuda" if torch.cuda.is_available() else "cpu"

print("=" * 60)
print("DEVICE:", device)

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
    print(
        "VRAM:",
        round(
            torch.cuda.get_device_properties(0).total_memory
            / 1024**3,
            2
        ),
        "GB"
    )

print("=" * 60)

# =========================================================
# PREVENT CONCURRENT SDXL GENERATIONS
# =========================================================

generation_lock = asyncio.Lock()

# =========================================================
# LOAD RMBG
# =========================================================

print("Loading RMBG...")

session = ort.InferenceSession(
    "./model/onnx/model_fp16.onnx",
    providers=[
        "CUDAExecutionProvider",
        "CPUExecutionProvider"
    ]
)

input_name = session.get_inputs()[0].name

print("RMBG Loaded!")

# =========================================================
# LOAD SDXL TURBO
# =========================================================

print("Loading SDXL Turbo...")

pipe = AutoPipelineForText2Image.from_pretrained(
    "./model/sdxl-turbo",
    torch_dtype=torch.float16,
    variant="fp16",
    local_files_only=True
)

pipe.to(device)

pipe.enable_attention_slicing()
pipe.enable_vae_slicing()

# Optional xFormers optimization
try:
    pipe.enable_xformers_memory_efficient_attention()
    print("xFormers enabled")
except Exception:
    print("xFormers not available")

# Disable console progress bars
pipe.set_progress_bar_config(disable=True)

print("SDXL Turbo Loaded!")

# =========================================================
# ROOT
# =========================================================

@app.get("/")
async def root():

    return {
        "status": "running",
        "device": device
    }

# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
async def health():

    return {
        "status": "healthy",
        "gpu_available": torch.cuda.is_available(),
        "device": device
    }

# =========================================================
# PROCESS IMAGE
# =========================================================

@app.post("/process-image")
async def process_image(
    file: UploadFile = File(...),
    mode: str = Form(...),
    prompt: str = Form("")
):

    try:

        # =================================================
        # VALIDATE MODE
        # =================================================

        if mode not in ["remove", "fill"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid mode"
            )

        # =================================================
        # READ IMAGE
        # =================================================

        image_bytes = await file.read()

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        # =================================================
        # LIMIT IMAGE SIZE
        # =================================================

        MAX_SIZE = 1024

        image.thumbnail(
            (MAX_SIZE, MAX_SIZE),
            Image.LANCZOS
        )

        original_size = image.size

        # =================================================
        # RMBG PREPROCESS
        # =================================================

        img = np.array(image)

        img = cv2.resize(
            img,
            (1024, 1024),
            interpolation=cv2.INTER_LINEAR
        )

        img = img.astype(np.float32) / 255.0

        img = np.transpose(
            img,
            (2, 0, 1)
        )

        img = np.expand_dims(
            img,
            axis=0
        )

        # =================================================
        # RMBG INFERENCE
        # =================================================

        result = session.run(
            None,
            {input_name: img}
        )

        # =================================================
        # MASK
        # =================================================

        mask = result[0][0][0]

        mask = (
            mask * 255
        ).clip(
            0,
            255
        ).astype(
            np.uint8
        )

        mask = Image.fromarray(mask)

        mask = mask.resize(
            original_size,
            Image.LANCZOS
        )

        # =================================================
        # FOREGROUND
        # =================================================

        foreground = image.convert("RGBA")

        foreground.putalpha(mask)

        # =================================================
        # REMOVE ONLY
        # =================================================

        if mode == "remove":

            output = io.BytesIO()

            foreground.save(
                output,
                format="PNG"
            )

            output.seek(0)

            return StreamingResponse(
                output,
                media_type="image/png"
            )

        # =================================================
        # DEFAULT PROMPT
        # =================================================

        if not prompt.strip():

            prompt = (
                "beautiful realistic background, "
                "professional photography, "
                "high quality"
            )

        # =================================================
        # PRESERVE ASPECT RATIO
        # =================================================

        w, h = original_size

        max_dim = 768

        scale = min(
            max_dim / w,
            max_dim / h
        )

        width = int(w * scale)
        height = int(h * scale)

        width = max(
            512,
            (width // 8) * 8
        )

        height = max(
            512,
            (height // 8) * 8
        )

        foreground = foreground.resize(
            (width, height),
            Image.LANCZOS
        )

        # =================================================
        # SDXL GENERATION
        # =================================================

        async with generation_lock:

            with torch.inference_mode():

                background = pipe(
                    prompt=prompt,
                    width=width,
                    height=height,
                    num_inference_steps=4,
                    guidance_scale=0.0
                ).images[0]

        background = background.convert("RGBA")

        # =================================================
        # COMPOSITE
        # =================================================

        background.paste(
            foreground,
            (0, 0),
            foreground
        )

        # =================================================
        # OUTPUT
        # =================================================

        output = io.BytesIO()

        background.save(
            output,
            format="PNG"
        )

        output.seek(0)

        if torch.cuda.is_available():
            torch.cuda.empty_cache()

        return StreamingResponse(
            output,
            media_type="image/png"
        )

    except HTTPException:
        raise

    except Exception as e:

        print("ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

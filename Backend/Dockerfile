FROM nvidia/cuda:12.4.1-cudnn-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

# ======================================================
# SYSTEM DEPENDENCIES
# ======================================================

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    git \
    wget \
    curl \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# ======================================================
# WORKDIR
# ======================================================

WORKDIR /app

# ======================================================
# UPGRADE PIP
# ======================================================

RUN python3 -m pip install --upgrade pip

# ======================================================
# INSTALL CUDA TORCH
# ======================================================

RUN pip3 install \
    torch \
    torchvision \
    torchaudio \
    --index-url https://download.pytorch.org/whl/cu124

# ======================================================
# INSTALL PROJECT DEPENDENCIES
# ======================================================

COPY requirements.txt .

RUN pip3 install -r requirements.txt

# ======================================================
# COPY PROJECT FILES
# ======================================================

COPY . .

# ======================================================
# VERIFY MODEL PATHS
# ======================================================

RUN mkdir -p /app/model/onnx
RUN mkdir -p /app/model/sdxl-turbo

# ======================================================
# EXPOSE PORT
# ======================================================

EXPOSE 8000

# ======================================================
# START FASTAPI
# ======================================================

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

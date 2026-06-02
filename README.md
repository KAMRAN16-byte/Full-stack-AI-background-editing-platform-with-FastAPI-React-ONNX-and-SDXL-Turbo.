# 🎨 AI Background Remover & AI Background Generator

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-Backend-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vite-Build-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Docker-GPU-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/ONNX-RMBG-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/SDXL-Turbo-red?style=for-the-badge" />
</p>

<p align="center">
  Remove image backgrounds instantly and generate stunning AI-powered backgrounds using RMBG-2.0 and SDXL Turbo.
</p>

---

## ✨ Features

- AI-powered background removal using RMBG-2.0
- AI background generation using SDXL Turbo
- Transparent PNG output
- Prompt-based background replacement
- React + Vite modern UI
- FastAPI backend
- Docker deployment support
- NVIDIA GPU acceleration (CUDA)

---

## 🔥 Live Workflow
Step 1:
![Demo GIF](https://i.ibb.co/BHsV6m75/Sequence-01.gif)
Step 2:
![Demo GIF](https://i.ibb.co/4nYhX9tb/Sequence-02.gif)
Step 3:
![Demo GIF](https://i.ibb.co/RkwphnG3/Sequence-03.gif)
Step 4:
![Demo GIF](https://i.ibb.co/yB7gGTc7/Sequence-04.gif)
Step 5:
![Demo GIF](https://i.ibb.co/RGyp40Zf/Sequence-05-new.gif)
Step 6:
![Demo GIF](https://i.ibb.co/nM6dBgb1/Sequence-06.gif)



---

## 🎥 Demo

Add your YouTube demo:

```text
https://youtube.com/your-demo-video
```

---

## 🏗️ Architecture

```text
User
 │
 ▼
React + Vite Frontend
 │
 ▼
FastAPI Backend
 │
 ├── RMBG-2.0 (ONNX)
 │      │
 │      ▼
 │  Background Removal
 │
 └── SDXL Turbo
        │
        ▼
  AI Background Generation
```

---

## 📂 Repository Structure

```text
AI-Background-Remover/
│
├── frontend/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .dockerignore
│   └── README.md
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Axios
- Tailwind CSS
- ShadCN UI

### Backend
- FastAPI
- Python
- ONNX Runtime GPU
- PyTorch
- Diffusers
- OpenCV
- Pillow

---

## 📥 Model Downloads

### RMBG-2.0 ONNX

Official Model:

https://huggingface.co/briaai/RMBG-2.0

Place model here:

```text
backend/model/onnx/model_fp16.onnx
```

### SDXL Turbo

Official Model:

https://huggingface.co/stabilityai/sdxl-turbo

Download:

```bash
huggingface-cli download stabilityai/sdxl-turbo --local-dir ./model/sdxl-turbo
```

Place files here:

```text
backend/model/sdxl-turbo/
```

---

## ⚙️ Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🐳 Docker Deployment

Build:

```bash
docker build -t bgremover .
```

Run:

```bash
docker run -d --gpus all --name bgremover -p 8000:8000 -v /path/to/model:/app/model bgremover
```

---

## 🚀 API

### Health

```http
GET /health
```

### Process Image

```http
POST /process-image
```

Parameters:

| Field | Description |
|---------|---------|
| file | Input image |
| mode | remove / fill |
| prompt | AI background prompt |

---

## 📊 Tested Environment

- RTX 3060 12GB
- CUDA 12.4
- Docker GPU Runtime
- FastAPI
- React + Vite

---

## 🔒 .gitignore

```gitignore
model/
node_modules/
venv/
dist/
.env
```

---

## 🧠 Future Improvements

- User Authentication
- Credit System
- Stripe Payments
- HD Generation
- Batch Processing
- Cloud Deployment

---

## 👨‍💻 Author

Muhammad Kamran

Computer Science Engineering Student

If you like this project, give it a ⭐ on GitHub.

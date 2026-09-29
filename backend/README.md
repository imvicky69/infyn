# Infyn Media Downloader Backend (yt-dlp)

High-performance, lightweight FastAPI backend powered by `yt-dlp` for extracting and streaming Instagram Reels, Videos, and Audio.

## 🚀 Quick Start (Local)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   python main.py
   # or
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Verify:**
   Visit `http://localhost:8000/docs` to test endpoints via Swagger UI.

---

## 🐳 Docker Deployment

1. **Build image:**
   ```bash
   docker build -t infyn-ytdlp-backend .
   ```

2. **Run container:**
   ```bash
   docker run -p 8000:8000 infyn-ytdlp-backend
   ```

---

## 🔗 Connect with Infyn Next.js Frontend

Set the environment variable in `.env.local` inside the Next.js app:
```env
YT_DLP_BACKEND_URL=http://localhost:8000
```
*(If unset, Infyn automatically uses local `yt-dlp` CLI on the machine)*

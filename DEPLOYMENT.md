# NutriHer Deployment Guide
====================================
*Zero-Dependency Issues Production Guide*

NutriHer is structured into two decoupled, cloud-ready services:
1. **Frontend**: React 18 + Vite + Tailwind CSS SPA.
2. **Backend**: FastAPI + PyTorch EfficientNet-B0 inference engine (16.7 MB weights) + ICMR-NIN IFCT 2017 nutrition composition database.

---

## 🚀 Recommended Approach: Vercel (Frontend) + Render (Backend)

This is the industry-standard architecture with **the absolute least dependency friction**:
- **Zero Python/Linux mismatch issues**: The backend uses a self-contained Debian `Dockerfile` with CPU-only PyTorch (`--index-url https://download.pytorch.org/whl/cpu`), avoiding the 2GB+ CUDA wheel that crashes free tiers.
- **Zero Node/NPM issues**: Vercel auto-detects Vite from `package.json`, compiles static assets to an Edge CDN, and provides free SSL.

---

### Step 1: Push Code to GitHub

Open a terminal in `G:\My Drive\NutriHer`:

```bash
# 1. Initialize Git repository
git init

# 2. Add files (heavy datasets are automatically excluded via .gitignore)
git add .

# 3. Commit
git commit -m "feat: production deployment configuration for NutriHer"

# 4. Link to your GitHub repository and push
git remote add origin https://github.com/<YOUR_USERNAME>/nutriher.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Backend to Render (Free Web Service)

1. Log into [Render.com](https://render.com/).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `nutriher` repo.
4. Fill in settings:
   - **Name**: `nutriher-api`
   - **Region**: Any (e.g. *Oregon (US West)* or *Frankfurt*)
   - **Language / Environment**: **Docker** (Render will automatically detect the root `Dockerfile`)
   - **Instance Type**: **Free**
5. Click **Create Web Service**.
6. Render will build the container and deploy. Once live, copy your backend URL:
   `https://nutriher-api.onrender.com`

> **Note on Free Tier Sleep**: Free services spin down after 15 minutes of inactivity and take ~30 seconds to wake up on the first request.

---

### Step 3: Deploy Frontend to Vercel (Free CDN)

1. Log into [Vercel.com](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import your `nutriher` GitHub repository.
4. Configure the Project:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: Click *Edit* and select `nutriher-frontend/nutriher-frontend`
5. Expand **Environment Variables**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://nutriher-api.onrender.com` *(your Render URL from Step 2)*
6. Click **Deploy**.
7. In ~25 seconds, your app will be live at:
   `https://nutriher.vercel.app`

---

## ⚡ Alternative 1: 1-Click Render Blueprint (All on Render)

If you prefer hosting everything under a single dashboard:
1. Push this repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New +** → **Blueprint**.
3. Connect your repository.
4. Render will read [`render.yaml`](file:///G:/My%20Drive/NutriHer/render.yaml) and automatically create both the backend API and frontend static site with the environment variables linked.

---

## 🐳 Alternative 2: Docker Compose (Run Anywhere / Any Cloud VPS)

To deploy both frontend and backend in isolated containers on an AWS EC2, DigitalOcean Droplet, or local machine:

```bash
docker compose up --build -d
```

- **Frontend**: Accessible on `http://localhost` (port 80) and `http://localhost:5173`.
- **Backend API**: Accessible on `http://localhost:8000` (docs at `/docs`).

---

## 📋 Verification Checklist

- [x] CPU-only PyTorch specified in [`requirements.txt`](file:///G:/My%20Drive/NutriHer/backend/requirements.txt) to avoid memory/CUDA bloat.
- [x] Dynamic `$PORT` binding implemented in [`backend/main.py`](file:///G:/My%20Drive/NutriHer/backend/main.py) for Render/Railway compatibility.
- [x] Permissive cloud CORS regex (`https?://.*`) enabled for Vercel/Render communication.
- [x] SPA rewrites configured in [`vercel.json`](file:///D:/nutriher%20-%20frontend/vercel.json) to prevent 404 errors on page refresh.
- [x] Model weights (`best_model.pth`, 16.7 MB) packaged within repository without Git LFS requirements.

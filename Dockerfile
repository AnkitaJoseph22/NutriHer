# ==============================================================================
# NutriHer Production Backend Container
# ==============================================================================
# Optimized for zero dependency issues:
# - Minimal Debian-based Python 3.11 Slim base image
# - Lightweight CPU-only PyTorch (saves >1.5GB of CUDA bloat)
# - Bundles EfficientNet-B0 weights (16.7 MB) & IFCT 2017 nutrition composition
# ==============================================================================

FROM python:3.11-slim

# Prevent Python from writing bytecode and enable real-time log flushing
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install minimal OS utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies using CPU-only wheels for PyTorch
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend source code, model checkpoint, and class mappings
COPY backend/ /app/backend/
COPY checkpoints/best_model.pth /app/checkpoints/
COPY training/classes.json /app/training/

# Expose default HTTP port
EXPOSE 8000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/docs || exit 1

# Launch FastAPI using Uvicorn with dynamic cloud PORT binding
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

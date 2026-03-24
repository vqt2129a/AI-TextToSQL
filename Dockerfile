# ====== Stage 1: Build React Frontend ======
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ====== Stage 2: Python Backend + Frontend Static ======
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Default port (Koyeb injects PORT env variable)
ENV PORT=8000

# Install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY server/app ./app

# Copy frontend build from Stage 1
COPY --from=frontend-builder /app/dist ./static

EXPOSE ${PORT}

WORKDIR /app/app

# Start FastAPI using PORT env variable (must use shell form for variable expansion)
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}

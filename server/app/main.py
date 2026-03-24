import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import google.generativeai as genai

import config
from config import GEMINI_API_KEY, PORT, logger
from routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup:
    - Validate Gemini API key
    - Auto-detect available Gemini models
    """
    logger.info("🚀 Starting application and scanning Gemini models...")

    if not GEMINI_API_KEY:
        logger.error("❌ GEMINI_API_KEY is missing")
        yield
        return

    try:
        genai.configure(api_key=GEMINI_API_KEY)

        models = [
            m.name for m in genai.list_models()
            if "generateContent" in m.supported_generation_methods
        ]

        logger.info(f"📋 Available models: {models}")

        priority = [
            "models/gemini-2.5-flash",
            "models/gemini-2.0-flash",
            "models/gemini-1.5-flash",
            "models/gemini-1.5-pro",
            "models/gemini-pro"
        ]

        for p in priority:
            if p in models:
                config.VALID_MODEL_ID = p
                break

        if not config.VALID_MODEL_ID:
            gemini_models = [m for m in models if "gemini" in m]
            if gemini_models:
                config.VALID_MODEL_ID = gemini_models[0]

        if config.VALID_MODEL_ID:
            logger.info(f"✅ Using Gemini model: {config.VALID_MODEL_ID}")
        else:
            logger.error("❌ No available Gemini model found")

    except Exception as e:
        logger.error(f"Model scan error: {e}")

    yield

app = FastAPI(
    title="SQL Assistant Fixed",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# API routes (must be before static files mount)
app.include_router(router)

# Serve React frontend static files (for production deployment)
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(STATIC_DIR):
    logger.info(f"📁 Serving frontend from: {STATIC_DIR}")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve React SPA - fallback to index.html for client-side routing"""
        file_path = os.path.join(STATIC_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))

    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)

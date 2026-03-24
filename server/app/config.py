import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection string (support both DATABASE_URL for Koyeb/Neon and DB_URI for local)
DB_URI = os.getenv("DATABASE_URL") or os.getenv("DB_URI")

# Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Server port (Koyeb injects PORT env variable)
PORT = int(os.getenv("PORT", "8000"))

# Global variable to store a valid Gemini model ID
VALID_MODEL_ID = None

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

# Application logger
logger = logging.getLogger("sql-assistant")

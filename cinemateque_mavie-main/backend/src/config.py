import os
from dotenv import load_dotenv

# Charger .env en local
#load_dotenv()

# --- Configuration de PostgreSQL ---

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST", "db")
DB_PORT = os.getenv("DB_PORT", "5432")
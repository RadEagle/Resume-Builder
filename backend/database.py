import os
from dotenv import load_dotenv
from pathlib import Path
from psycopg_pool import AsyncConnectionPool


load_dotenv(Path(__file__).resolve().parent / ".env")
DATABASE_URL = os.getenv("DATABASE_URL")
pool = AsyncConnectionPool(conninfo=DATABASE_URL, open=False)
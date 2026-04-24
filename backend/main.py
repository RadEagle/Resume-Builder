from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg_pool import AsyncConnectionPool
from dotenv import load_dotenv
import os
from pathlib import Path


load_dotenv(Path(__file__).resolve().parent / ".env")
DATABASE_URL = os.getenv("DATABASE_URL")
pool = AsyncConnectionPool(conninfo=DATABASE_URL, open=False)

# Define the lifespan manager <& CODING PATTERN &>
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Logic ---
    # Put code here to run BEFORE the app starts (e.g., connect to DB)
    if not DATABASE_URL:
        raise RuntimeError("Missing Database URL")
    
    await pool.open()
    print("Database connection pool opened")
    
    yield  # The app stays in this "yield" state while running
    
    # --- Shutdown Logic ---
    # Put code here to run AFTER the app stops (e.g., close DB)
    await pool.close()
    print("Database connection pool closed")

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def main():
    if not DATABASE_URL:
        raise HTTPException(status_code=500, detail="Missing DATABASE_URL")
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT * FROM experience;");
                result = await cur.fetchone()
                print(f"Result: {result}")
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    return {"message": "resume-vault-api"}


@app.get("/health/db")
async def health_db():
    if not DATABASE_URL:
        raise HTTPException(status_code=500, detail="Missing DATABASE_URL")
    try:
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute("SELECT 1")
                row = await cur.fetchone()
        return {"ok": True, "db": "up", "check": row}
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
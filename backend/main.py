from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import pool, DATABASE_URL
from routers.profiles import router as profiles_router
from routers.experiences import router as experiences_router
from routers.bullets import router as bullets_router
from routers.edu_details import router as edu_details_router
from routers.courses import router as courses_router


# 1. Define the lifespan manager <& CODING PATTERN &>
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

# 2. Define the CORS middleware
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

# 3. Declare which routers to include
app.include_router(profiles_router, prefix="/api")
app.include_router(experiences_router, prefix="/api")
app.include_router(bullets_router, prefix="/api")
app.include_router(edu_details_router, prefix="/api")
app.include_router(courses_router, prefix="/api")

# 4. Set up the app factory
@app.get("/")
async def main():
    if not DATABASE_URL:
        raise HTTPException(status_code=500, detail="Missing DATABASE_URL")

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

# 5. Run the code
# uvicorn main:app --reload --port 8000

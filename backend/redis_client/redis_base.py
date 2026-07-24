import os
from dotenv import load_dotenv
from pathlib import Path
import redis.asyncio as redis
from fastapi import Request


load_dotenv(Path(__file__).resolve().parent.parent / ".env")
REDIS_URL = os.getenv("REDIS_URL")
_redis: redis.Redis | None = None


async def init_redis():
    if not REDIS_URL:
        print("Redis rate limiting is disabled")
        return

    global _redis
    _redis = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    print(f"Ping successful: {await _redis.ping()}")


async def close_redis():
    global _redis
    if not _redis:
        return

    await _redis.aclose()
    _redis = None


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    if request.client:
        return request.client.host
        
    return "unknown"
    

def redis_client_exists() -> bool:
    if _redis:
        return True
    return False

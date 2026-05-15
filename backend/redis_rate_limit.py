import os
from dotenv import load_dotenv
from pathlib import Path
import redis.asyncio as redis
from redis.exceptions import RedisError
from fastapi import HTTPException, Request
from typing import Optional


load_dotenv(Path(__file__).resolve().parent / ".env")
REDIS_URL = os.getenv("REDIS_URL")
AUTH_RATE_LIMIT_MAX = 3
AUTH_RATE_WINDOW_SEC = 60

_redis: Optional[redis.Redis] = None # Fix this


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


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    if request.client:
        return request.client.host
        
    return "unknown"


async def enforce_auth_rate_limit(request: Request) -> None:
    if not _redis:
        return

    ip = _client_ip(request)
    key = f"rl:auth:{ip}"

    try:
        n = await _redis.incr(key)
        if n == 1:
            await _redis.expire(key, AUTH_RATE_WINDOW_SEC)
        
        if n > AUTH_RATE_LIMIT_MAX:
            raise HTTPException(429, detail="Maximum login attempts reached")
    except HTTPException:
        raise
    except RedisError as e:
        print(repr(e))
        raise HTTPException(503, detail="Rate limit service unavailable")

    

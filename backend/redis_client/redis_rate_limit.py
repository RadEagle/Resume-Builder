from redis.exceptions import RedisError
from fastapi import HTTPException, Request
from .redis_base import client_ip, get_redis, redis_client_exists


AUTH_RATE_LIMIT_MAX = 10
AUTH_RATE_WINDOW_SEC = 60


async def enforce_auth_rate_limit(request: Request) -> None:
    if not redis_client_exists():
        return

    ip = client_ip(request)
    key = f"rl:auth:{ip}"

    try:
        n = await get_redis().incr(key)
        if n == 1:
            await get_redis().expire(key, AUTH_RATE_WINDOW_SEC)
        
        if n > AUTH_RATE_LIMIT_MAX:
            raise HTTPException(429, detail="Maximum login attempts reached")
    except HTTPException:
        raise
    except RedisError as e:
        print(repr(e))
        raise HTTPException(503, detail="Rate limit service unavailable")

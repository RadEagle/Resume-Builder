from typing import Optional
from .redis_base import _redis
import secrets


async def store_reset_token(user_id: int) -> Optional[str]:
    if not _redis:
        return None

    token = secrets.token_urlsafe(32)
    await _redis.set(f"pwdreset:{token}", str(user_id), ex=1800)
    return token


async def get_reset_user_id(token) -> Optional[int]:
    if not _redis:
        return None
        
    user_id = await _redis.get(f"pwdreset:{token}")
    if not user_id:
        return None

    return int(user_id)


async def delete_reset_token(token) -> None:
    if not _redis:
        return

    await _redis.delete(f"pwdreset:{token}")    
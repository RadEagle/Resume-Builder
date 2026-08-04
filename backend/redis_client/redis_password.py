from typing import Optional
from .redis_base import get_redis, redis_client_exists
import secrets


TOKEN_LIFE_SEC=1800


async def store_reset_token(user_id: int) -> Optional[str]:
    if not redis_client_exists():
        return None

    token = secrets.token_urlsafe(32)
    await get_redis().set(f"pwdreset:{token}", str(user_id), ex=TOKEN_LIFE_SEC)
    return token


async def get_reset_user_id(token) -> Optional[int]:
    if not redis_client_exists():
        return None
        
    user_id = await get_redis().get(f"pwdreset:{token}")
    if not user_id:
        return None

    return int(user_id)


async def delete_reset_token(token) -> None:
    if not redis_client_exists():
        return

    await get_redis().delete(f"pwdreset:{token}")
 
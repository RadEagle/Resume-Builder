from fastapi import APIRouter, HTTPException
from database import pool
from schemas import UserRegister, UserLogin, TokenResponse
from psycopg.rows import dict_row
import routers.utilities as utilities


router = APIRouter(
    prefix="/auth", 
    tags=["authentication"]
)


@router.post("register", response_model=TokenResponse)
async def register_user(body: UserRegister):
    await utilities.check_duplicate_email(body.email)

    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO users (email, password_hash)
                    VALUES (%s, %s)
                    RETURNING id, email, created_at
                    ''',
                    (body.email, password_hash),
                )
                row = await cur.fetchone()
        return TokenResponse(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
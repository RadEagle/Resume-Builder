from fastapi import HTTPException
from database import pool
from psycopg.rows import dict_row


async def ensure_profile_id_exists(profile_id: int, user_id):
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT 1 FROM resume_profile
                    WHERE id = %s AND user_id = %s
                    ''',
                    (profile_id, user_id),
                )
                row = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")


async def ensure_exp_id_exists(profile_id: int, experience_id: int, user_id: int):
    await ensure_profile_id_exists(profile_id, user_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT 1 FROM experience
                    WHERE id = %s AND profile_id = %s
                    ''',
                    (experience_id, profile_id),
                )
                row = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    if not row:
        raise HTTPException(status_code=404, detail="Experience not found")


async def check_duplicate_email(email: str):
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT email FROM users
                    WHERE LOWER(email) = LOWER(%s)
                    ORDER BY id LIMIT 1
                    ''',
                    (email,),
                )
                email_exists = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    if email_exists:
        raise HTTPException(status_code=409, detail="Email already used")

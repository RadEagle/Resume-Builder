from fastapi import APIRouter, Depends, HTTPException
from database import pool
from schemas import ProfileCreate, ProfileRead
from psycopg.rows import dict_row
import routers.utilities as utilities
from security import current_user_id


router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("", response_model=list[ProfileRead])
async def list_profiles(user_id: int = Depends(current_user_id)):
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT id, name, created_at FROM resume_profile
                    WHERE user_id = %s
                    ORDER by id
                    ''',
                    (user_id,),
                )
                rows = await cur.fetchall()
        return [ProfileRead(**row) for row in rows]
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")


@router.post("", response_model=ProfileRead)
async def create_profile(body: ProfileCreate, user_id: int = Depends(current_user_id)):
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO resume_profile (user_id, name)
                    VALUES (%s, %s)
                    RETURNING id, user_id, name, created_at
                    ''',
                    (user_id, body.name),
                )
                row = await cur.fetchone()
        return ProfileRead(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
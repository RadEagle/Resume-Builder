from fastapi import APIRouter, HTTPException
from database import pool
from schemas import BulletCreate, BulletRead
from psycopg.rows import dict_row
import routers.utilities as utilities


router = APIRouter(
    prefix="/profiles/{profile_id}/experiences/{experience_id}/bullets", 
    tags=["bullets"]
)

@router.get("", response_model=list[BulletRead])
async def list_bullets(profile_id: int, experience_id: int):
    await utilities.ensure_exp_id_exists(profile_id, experience_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT id, experience_id, body, sort_order FROM experience_bullet
                    WHERE experience_id = %s
                    ORDER by id
                    ''',
                    (experience_id,),
                )
                rows = await cur.fetchall()
        return [BulletRead(**row) for row in rows]
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")


@router.post("", response_model=BulletRead)
async def create_bullet(profile_id: int, experience_id: int, body: BulletCreate):
    await utilities.ensure_exp_id_exists(profile_id, experience_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO experience_bullet (experience_id, body, sort_order)
                    VALUES (%s, %s, %s)
                    RETURNING id, experience_id, body, sort_order
                    ''',
                    (experience_id, body.body, body.sort_order),
                )
                row = await cur.fetchone()
        return BulletRead(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
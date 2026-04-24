from fastapi import APIRouter, HTTPException
from database import pool
from schemas import EduDetailCreate, EduDetailRead
from psycopg.rows import dict_row
import routers.utilities as utilities


router = APIRouter(
    prefix="/profiles/{profile_id}/experiences/{experience_id}/edu-details", 
    tags=["edu-details"]
)

@router.get("", response_model=list[EduDetailRead])
async def list_education_details(profile_id: int, experience_id: int):
    await utilities.ensure_exp_id_exists(profile_id, experience_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT experience_id, gpa FROM education_detail
                    WHERE experience_id = %s
                    ''',
                    (experience_id,),
                )
                rows = await cur.fetchall()
        return [EduDetailRead(**row) for row in rows]
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")


@router.post("", response_model=EduDetailRead)
async def create_education_detail(profile_id: int, experience_id: int, body: EduDetailCreate):
    await utilities.ensure_exp_id_exists(profile_id, experience_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO education_detail (experience_id, gpa)
                    VALUES (%s, %s)
                    RETURNING experience_id, gpa
                    ''',
                    (experience_id, body.gpa),
                )
                row = await cur.fetchone()
        return EduDetailRead(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
from fastapi import APIRouter, Depends, HTTPException
from database import pool
from schemas import EduDetailCreate, EduDetailRead
from psycopg.rows import dict_row
import routers.utilities as utilities
from security import current_user_id


router = APIRouter(
    prefix="/profiles/{profile_id}/experiences/{experience_id}/edu-details", 
    tags=["edu-details"]
)

@router.get("", response_model=list[EduDetailRead])
async def list_education_details(profile_id: int, experience_id: int, user_id: int = Depends(current_user_id)):
    await utilities.ensure_exp_id_exists(profile_id, experience_id, user_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT experience_id, degree, major, gpa FROM education_detail
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
async def create_education_detail(profile_id: int, experience_id: int, body: EduDetailCreate, user_id: int = Depends(current_user_id)):
    await utilities.ensure_exp_id_exists(profile_id, experience_id, user_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO education_detail (experience_id, degree, major, gpa)
                    VALUES (%s, %s, %s, %s)
                    RETURNING experience_id, degree, major, gpa
                    ''',
                    (experience_id, body.degree, body.major, body.gpa),
                )
                row = await cur.fetchone()
        return EduDetailRead(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
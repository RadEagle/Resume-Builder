from fastapi import APIRouter, Depends, HTTPException
from database import pool
from schemas import CourseCreate, CourseRead
from psycopg.rows import dict_row
import routers.utilities as utilities
from security import current_user_id


router = APIRouter(
    prefix="/profiles/{profile_id}/experiences/{experience_id}/courses", 
    tags=["edu-courses"]
)

@router.get("", response_model=list[CourseRead])
async def list_education_courses(profile_id: int, experience_id: int, user_id: int = Depends(current_user_id)):
    await utilities.ensure_exp_id_exists(profile_id, experience_id, user_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT id, experience_id, name, code, sort_order FROM education_course
                    WHERE experience_id = %s
                    ''',
                    (experience_id,),
                )
                rows = await cur.fetchall()
        return [CourseRead(**row) for row in rows]
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")


@router.post("", response_model=CourseRead)
async def create_education_course(profile_id: int, experience_id: int, body: CourseCreate, user_id: int = Depends(current_user_id)):
    await utilities.ensure_exp_id_exists(profile_id, experience_id, user_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO education_course (experience_id, name, code, sort_order)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id, experience_id, name, code, sort_order
                    ''',
                    (experience_id, body.name, body.code, body.sort_order),
                )
                row = await cur.fetchone()
        return CourseRead(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
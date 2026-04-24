from fastapi import APIRouter, HTTPException
from database import pool
from schemas import ExperienceCreate, ExperienceRead
from psycopg.rows import dict_row
import routers.utilities as utilities


router = APIRouter(
    prefix="/profiles/{profile_id}/experiences", 
    tags=["experiences"]
)

@router.get("", response_model=list[ExperienceRead])
async def list_experiences(profile_id: int):
    await utilities.ensure_profile_id_exists(profile_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT id, profile_id, title, organization, location, kind, start_date, end_date FROM experience
                    WHERE profile_id = %s
                    ORDER by id
                    ''',
                    (profile_id,),
                )
                rows = await cur.fetchall()
        return [ExperienceRead(**row) for row in rows]
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")


@router.post("", response_model=ExperienceRead)
async def create_experience(profile_id: int, body: ExperienceCreate):
    await utilities.ensure_profile_id_exists(profile_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO experience (profile_id, title, organization, location, kind, start_date, end_date)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, profile_id, title, organization, location, kind, start_date, end_date
                    ''',
                    (profile_id, body.title, body.organization, body.location, body.kind, body.start_date, body.end_date),
                )
                row = await cur.fetchone()
        return ExperienceRead(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
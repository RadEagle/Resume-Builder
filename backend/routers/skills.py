from fastapi import APIRouter, Depends, HTTPException
from database import pool
from schemas import SkillCreate, SkillRead
from psycopg.rows import dict_row
import routers.utilities as utilities
from security import current_user_id


router = APIRouter(
    prefix="/profiles/{profile_id}/skills", 
    tags=["skills"]
)

@router.get("", response_model=list[SkillRead])
async def list_skills(profile_id: int, user_id: int = Depends(current_user_id)):
    await utilities.ensure_profile_id_exists(profile_id, user_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT id, profile_id, name, category FROM skill
                    WHERE profile_id = %s
                    ORDER by id
                    ''',
                    (profile_id,),
                )
                rows = await cur.fetchall()
        return [SkillRead(**row) for row in rows]
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")


@router.post("", response_model=SkillRead)
async def create_skill(profile_id: int, body: SkillCreate, user_id: int = Depends(current_user_id)):
    await utilities.ensure_profile_id_exists(profile_id, user_id)
    
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO skill (profile_id, name, category)
                    VALUES (%s, %s, %s)
                    RETURNING id, profile_id, name, category
                    ''',
                    (profile_id, body.name, body.category),
                )
                row = await cur.fetchone()
        return SkillRead(**row)
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")
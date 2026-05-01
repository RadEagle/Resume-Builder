from fastapi import APIRouter, HTTPException
from database import pool
from schemas import UserRegister, UserLogin, UserRead, TokenResponse
from psycopg.rows import dict_row
import routers.utilities as utilities
import security


router = APIRouter(
    prefix="/auth", 
    tags=["authentication"]
)


@router.post("/register", response_model=TokenResponse)
async def register_user(body: UserRegister):
    await utilities.check_duplicate_email(body.email)
    password_hash = security.hash_password(body.password)

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
                user_dict = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    token = security.create_access_token(user_dict["id"])
    response = TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserRead(**user_dict)
    )

    return response


@router.post("/login", response_model=TokenResponse)
async def login_user(body: UserLogin):
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT id, email, created_at, password_hash FROM users
                    WHERE LOWER(email) = LOWER(%s)
                    ''',
                    (body.email,),
                )
                user_dict = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    if not user_dict or not security.verify_password(body.password, user_dict["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect username and/or password")
        
    token = security.create_access_token(user_dict["id"])
    user_dict.pop("password_hash", None) # exclude password_hash
    response = TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserRead(**user_dict)
    )

    return response
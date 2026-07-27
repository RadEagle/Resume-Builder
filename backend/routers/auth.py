from fastapi import APIRouter, HTTPException, Depends
from database import pool
from schemas import ForgotPasswordRequest, ForgotPasswordResponse, ResetPasswordRequest, ResetPasswordResponse, UserRegister, UserLogin, UserRead, TokenResponse
from psycopg.rows import dict_row
import routers.utilities as utilities
import security
from redis_client.redis_base import redis_client_exists
from redis_client.redis_password import delete_reset_token, get_reset_user_id, store_reset_token
from redis_client.redis_rate_limit import enforce_auth_rate_limit


router = APIRouter(
    prefix="/auth", 
    tags=["authentication"]
)


@router.post("/register", response_model=TokenResponse, dependencies=[Depends(enforce_auth_rate_limit)])
async def register_user(body: UserRegister):
    username_lowercase = body.username.lower()
    await utilities.check_duplicate_username(username_lowercase)
    await utilities.check_duplicate_email(body.email)
    password_hash = security.hash_password(body.password)

    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    INSERT INTO users (username, email, password_hash)
                    VALUES (%s, %s, %s)
                    RETURNING id, username, email, created_at
                    ''',
                    (username_lowercase, body.email, password_hash),
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


@router.post("/login", response_model=TokenResponse, dependencies=[Depends(enforce_auth_rate_limit)])
async def login_user(body: UserLogin):
    if "@" in body.identifier:
        where = "LOWER(email) = LOWER(%s)"
    else:
        where = "LOWER(username) = LOWER(%s)"

    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    f'''
                    SELECT id, username, email, created_at, password_hash FROM users
                    WHERE {where}
                    ''',
                    (body.identifier,),
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


@router.post("/forgot-password", response_model=ForgotPasswordResponse, dependencies=[Depends(enforce_auth_rate_limit)])
async def forgot_password(body: ForgotPasswordRequest):
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT id, email FROM users
                    WHERE LOWER(email) = LOWER(%s)
                    ''',
                    (body.email,),
                )
                user_dict = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    if user_dict and redis_client_exists():
        token = await store_reset_token(user_dict["id"])
        frontend_url = utilities.get_frontend_url()
        if token and frontend_url:
            link = f"{frontend_url}?reset_token={token}"
            utilities.send_password_reset_email(body.email, link)

    response = ForgotPasswordResponse(
        message="Request to change password sent"
    )

    return response


@router.post("/reset-password", response_model=ResetPasswordResponse, dependencies=[Depends(enforce_auth_rate_limit)])
async def reset_password(body: ResetPasswordRequest):
    user_id = await get_reset_user_id(body.token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized access")

    password_hash = security.hash_password(body.password)
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    UPDATE users 
                    SET password_hash = %s
                    WHERE id = %s
                    RETURNING id
                    ''',
                    (password_hash, user_id),
                )
                user_dict = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    if not user_dict:
        raise HTTPException(status_code=404, detail="Not found")

    await delete_reset_token(body.token)
    response = ResetPasswordResponse(
        message = "Password updated"
    )

    return response
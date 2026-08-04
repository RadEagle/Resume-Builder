import os
from botocore.discovery import BotoCoreError
from dotenv import load_dotenv
from pathlib import Path
import logging
from fastapi import HTTPException
from database import pool
from psycopg.rows import dict_row
import boto3
from botocore.exceptions import ClientError, NoCredentialsError


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

async def check_duplicate_username(username: str):
    try:
        async with pool.connection() as conn:
            async with conn.cursor(row_factory=dict_row) as cur:
                await cur.execute(
                    '''
                    SELECT username FROM users
                    WHERE LOWER(username) = LOWER(%s)
                    ORDER BY id LIMIT 1
                    ''',
                    (username,),
                )
                username_exists = await cur.fetchone()
    except Exception as e:
        print(repr(e))
        raise HTTPException(status_code=503, detail="Database unavailable")

    if username_exists:
        raise HTTPException(status_code=409, detail="Username already used")


def get_frontend_url() -> str:
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
    FRONTEND_URL = os.getenv("FRONTEND_URL")
    log = logging.getLogger(__name__)

    if not FRONTEND_URL:
        log.warning("No frontend URL defined")

    return FRONTEND_URL.strip("/")


def send_password_reset_email(to_email, reset_link):
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
    SES_FROM_EMAIL = os.getenv("SES_FROM_EMAIL")
    AWS_REGION = os.getenv("AWS_REGION")
    log = logging.getLogger(__name__)

    if not SES_FROM_EMAIL:
        log.warning("SES not configured")
        return False

    if not AWS_REGION:
        log.warning("AWS Region not configured")
        return False

    template = (Path(__file__).resolve().parent.parent / "templates" / "reset_password.html").read_text(encoding="utf-8")
    html_body = template.replace("{{reset_link}}", reset_link)

    client = boto3.client("ses", region_name=AWS_REGION)
    try:
        client.send_email(
            Source=SES_FROM_EMAIL,
            Destination={
                'ToAddresses': [to_email]
            },
            Message={
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': "reset your password",
                },
                'Body': {
                    'Html': {
                        'Charset': 'UTF-8',
                        'Data': html_body,
                    },
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': f"Reset your password: {reset_link}",
                    }
                }
            },
        )

        return True

    except ClientError:
        log.exception("ClientError: SES send failed")
        return False
    except NoCredentialsError:
        log.exception("NoCredentialsError: SES send failed")
        return False

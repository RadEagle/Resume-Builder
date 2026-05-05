import os
from dotenv import load_dotenv
from pathlib import Path
import datetime
import bcrypt
import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


load_dotenv(Path(__file__).resolve().parent / ".env")
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))


def hash_password(password: str):
    encrypted_pass = password.encode('utf-8')
    return bcrypt.hashpw(encrypted_pass, bcrypt.gensalt()).decode('utf-8')


# don't pass in the unhashed db_password
def verify_password(password: str, db_hash: str):
    encrypted_pass = password.encode('utf-8')
    hash = db_hash.encode('utf-8')

    return bcrypt.checkpw(encrypted_pass, hash)


def create_access_token(user_id: int) -> str:
    if not JWT_SECRET or not JWT_ALGORITHM:
        raise ValueError("Missing JWT secret key and/or algorithm")

    payload = {
        "sub": str(user_id),
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        if not JWT_SECRET or not JWT_ALGORITHM:
            raise HTTPException(status_code=503, detail="Missing JWT secret key and/or algorithm")
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def current_user_id(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    token = credentials.credentials
    payload = decode_access_token(token)
    sub = payload.get("sub")

    if not sub or not sub.isdigit():
        raise HTTPException(status_code=401, detail="Missing sub")

    return int(sub)

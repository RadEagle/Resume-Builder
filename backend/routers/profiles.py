from fastapi import APIRouter, Depends

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("")
async def list_profiles():
    ...

@router.post("")
async def create_profile():
    ...
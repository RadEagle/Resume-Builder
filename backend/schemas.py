from datetime import datetime
from pydantic import BaseModel, Field

# ProfileCreate
class ProfileCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=20)


# ProfileRead
class ProfileRead(BaseModel):
    id: int
    name: str
    created_at: datetime
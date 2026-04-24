from datetime import datetime, date
from pydantic import BaseModel, Field
from typing import Literal, Optional


# ProfileCreate
class ProfileCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=20)


# ProfileRead
class ProfileRead(BaseModel):
    id: int
    name: str
    created_at: datetime


# ExperienceCreate
class ExperienceCreate(BaseModel):
    title: str = Field(None, max_length=50)
    organization: str = Field(None, max_length=50)
    location: str = Field(None, max_length=50)
    kind: Literal['school', 'work', 'side_project']
    start_date: date
    end_date: date | None = None


# ExperienceRead
class ExperienceRead(BaseModel):
    id: int
    profile_id: int
    title: Optional[str]
    organization: Optional[str]
    location: Optional[str]
    kind: Literal['school', 'work', 'side_project']
    start_date: date
    end_date: date | None


# BulletCreate
class BulletCreate(BaseModel):
    body: str = Field(None, max_length=300)
    sort_order: int = 0


# BulletRead
class BulletRead(BaseModel):
    id: int
    experience_id: int
    body: str
    sort_order: int


# EduDetailCreate
class EduDetailCreate(BaseModel):
    gpa: float = 0.000


# EduDetailRead
class EduDetailRead(BaseModel):
    experience_id: int
    gpa: float


# CourseCreate


# CourseRead


# SkillCreate


# SkillRead

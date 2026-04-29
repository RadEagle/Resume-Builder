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
    title: str | None = Field(None, max_length=50)
    organization: str | None = Field(None, max_length=50)
    location: str | None = Field(None, max_length=50)
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
    body: str = Field(..., min_length=1, max_length=300)
    sort_order: int = 0


# BulletRead
class BulletRead(BaseModel):
    id: int
    experience_id: int
    body: str
    sort_order: int


# EduDetailCreate
class EduDetailCreate(BaseModel):
    degree: str = Field(..., min_length=1, max_length=30)
    major: str | None = Field(None, max_length=30)
    gpa: float | None = Field(None, ge=0.000, le=4.000, multiple_of=0.001)


# EduDetailRead
class EduDetailRead(BaseModel):
    experience_id: int
    degree: str
    major: str | None
    gpa: float | None


# CourseCreate
class CourseCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=30)
    code: str | None = Field(None, max_length=15)
    sort_order: int = 0


# CourseRead
class CourseRead(BaseModel):
    id: int
    experience_id: int
    name: str
    code: Optional[str]
    sort_order: int


# SkillCreate
class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=30)
    category: Literal["technical", "soft", "interest"]


# SkillRead
class SkillRead(BaseModel):
    id: int
    profile_id: int
    name: str
    category: Literal["technical", "soft", "interest"]

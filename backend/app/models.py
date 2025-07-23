from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    title: str
    description: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class Report(ReportBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    content: str  # JSON ou string com estrutura do template

class TemplateCreate(TemplateBase):
    pass

class Template(TemplateBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    created_at: Optional[datetime] = None

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserSettings(BaseModel):
    id: int
    user_id: str
    notifications_enabled: bool = True
    theme: Optional[str] = "light"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class UserSettingsUpdate(BaseModel):
    notifications_enabled: Optional[bool] = None
    theme: Optional[str] = None 
from pydantic import BaseModel
from typing import Optional
from enum import Enum

class User_Type(Enum):
    Normal = 1
    Assessor = 2


class User(BaseModel):
    username: str
    password: str
    phone: str
    type: User_Type
    profile:Optional[str]
    assessor_score:int=0
    token:str
    
class Add_User(BaseModel):
    username: str
    password: str
    phone: str


class Get_User(BaseModel):
    username: str
    phone: str
    type: User_Type
    profile:Optional[str]
    Participation:int=0
    AcceptedSentences:int=0
    Score :int=0
    words :Optional[list[str]]

class Login_User(BaseModel):
    username: str
    password: str

class Update_User(BaseModel):
    password: Optional[str]
    phone: str

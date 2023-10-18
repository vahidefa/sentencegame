from pydantic import BaseModel
from typing import List
from datetime import datetime
from enum import Enum



class Sentence(BaseModel):
    content: str
    user_id:str
    at: datetime
    score:int
    is_sent:bool=False

class Determine_Sentence(BaseModel):
    id:str
    score:int

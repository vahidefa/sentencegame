from pydantic import BaseModel
from typing import List
from datetime import datetime

class Game(BaseModel):
    user_id: str
    sentence_ids:List[str]
    at: datetime


class GameForAdd(BaseModel):
    sentences:List[str]
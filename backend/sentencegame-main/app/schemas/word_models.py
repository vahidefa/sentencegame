from pydantic import BaseModel
from typing import List

class Word(BaseModel):
    word: str
    is_deleted:bool=False

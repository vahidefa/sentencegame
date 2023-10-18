from enum import Enum


class Response(Enum):
    Success = 1
    UnSuccess = 2
    AccessDenied = 3
    NotExist = 4
    Exist = 5
    WrongInput = 6

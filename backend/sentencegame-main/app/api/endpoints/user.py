from fastapi import APIRouter, Depends, UploadFile, File, Query, Header
from app.schemas.user_models import User, User_Type, Add_User, Get_User, Login_User, Update_User
from app.api.dependencies.extensions import generate_id, generate_fileName,generate_token
from app.schemas.general_models import Response
from app.db.mongo import db
import hashlib
import re
import os
from app.ai.words import get_words
import random

UPLOAD_DIRECTORY = r"C:\inetpub\wwwroot\cdn"
IMG_ADDRESS = "http://193.176.241.213:5001/"


router = APIRouter()


def get_custom_header(token: str = Header(...)):
    return token


@router.post("/user/register")
async def register_user(user: Add_User):
    try:
        existing_user = db.db.users.find_one({"username": user.username})
        
        if existing_user:
            return {"status": Response.Exist}
        
        phone_pattern = re.compile(r'^09\d{9}$')
        
        if not phone_pattern.match(user.phone):
            return {"status": Response.WrongInput}

        hashed_password = hashlib.sha512(user.password.encode()).hexdigest()
        
        user_id = generate_id()
        
        token=generate_token()
        
        db.db.users.insert_one({
            "_id": user_id,
            "username": user.username,
            "password": hashed_password,
            "phone": user.phone,
            "type": User_Type.Normal.value,
            "profile": None,
            "assessor_score": 0,
        })

        return {"status": Response.Success}
    
    except Exception:
        return {"status": Response.UnSuccess}

@router.post("/user/login")
async def login_user(user: Login_User):
    try:
        hashed_password = hashlib.sha512(user.password.encode()).hexdigest()

        existing_user = db.db.users.find_one({"username": user.username, "password": hashed_password})

        if existing_user:
            token = generate_token()
            db.db.users.update_one( {"_id": existing_user["_id"]}, {"$set": {"token": token}})
            return {"status": Response.Success, "token": token}
        
        return {"status": Response.NotExist}
    
    except Exception  as e:
        return {"status": Response.UnSuccess,"exception ":e  ,"inner_exception" :e.__cause__  }

@router.get("/user")    
async def get_user(token: str = Depends(get_custom_header)):
    try:    
        user = db.db.users.find_one({"token": token})
    
        if user:
            user_object = User(**user)
            user_for_get = Get_User(**user_object.dict())
            totalSentences = db.db.sentences.count_documents({"user_id": user["_id"]})
            user_for_get.AcceptedSentences = db.db.sentences.count_documents({"user_id": user["_id"], "score": {"$gte": 4}})
            user_for_get.Participation = db.db.games.count_documents({"user_id": user["_id"]})
            user_for_get.Score = user_for_get.AcceptedSentences+totalSentences
            words = get_words()
            if len(words)<20:
                user_for_get.words= words
            else:
                user_for_get.words = random.sample(words, 30)
            return {"status": Response.Success, "User": user_for_get}
        
        return {"status": Response.NotExist}
    
    except Exception:
        return {"status": Response.UnSuccess}

@router.post("/user/upload")
async def upload_image(token: str = Depends(get_custom_header), file: UploadFile = File(...)):
    try:
        user = db.db.users.find_one({"token": token})

        if user:
            os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
            
            filename =generate_fileName() + os.path.splitext(file.filename)[1]
            
            file_path = os.path.join(UPLOAD_DIRECTORY, filename)
            with open(file_path, "wb") as f:
                f.write(await file.read())
                
            filename =IMG_ADDRESS+ filename

            db.db.users.update_one( {"_id": user["_id"]}, {"$set": {"profile": filename}})
            return {"status": Response.Success}
        
        return {"status": Response.NotExist}
    
    except Exception:
        return {"status": Response.UnSuccess}

@router.put("/user/update")
async def update_user(update_user: Update_User, token: str = Depends(get_custom_header)):
    try:
        user = db.db.users.find_one({"token": token})
        
        phone_pattern = re.compile(r'^09\d{9}$')
        
        if not phone_pattern.match(update_user.phone):
            return {"status": Response.WrongInput}
        
        if update_user.password:
            hashed_password = hashlib.sha512(update_user.password.encode()).hexdigest()
        
            db.db.users.update_one({"_id": user["_id"]}, {"$set": {"phone": update_user.phone, "password": hashed_password , "token":None}})
        
        else:
            db.db.users.update_one({"_id": user["_id"]}, {"$set": {"phone": update_user.phone}})

        return {"status": Response.Success}
    except Exception:
        return {"status": Response.UnSuccess}

@router.get("/users")
async def get_users_list(token: str = Depends(get_custom_header), skip: int = Query(..., description="skip"), limit: int = Query(..., description="limit")):
    try:
        user = db.db.users.find_one({"token": token})
        if user:
            if user["type"] == User_Type.Assessor.value:
                users = []
                users_cursor = db.db.users.find({}).skip(skip).limit(limit)
                users_count = db.db.users.count_documents({})
                for user in users_cursor:
                    games = db.db.games.count_documents({"user_id": user["_id"]})
                    users.append({
                    "id": user["_id"],
                    "username": user["username"],
                    "score": games,
                    "assessor_score":user["assessor_score"]
                    })
                return {"status": Response.Success, "Users": users, "Count": users_count}
            else:
                users = []
                users_cursor = db.db.users.find({}).skip(skip).limit(limit)
                users_count = db.db.users.count_documents({})
                for user in users_cursor:
                    games = db.db.games.count_documents({"user_id": user["_id"]})
                    users.append({
                    "id": user["_id"],
                    "username": user["username"],
                    "score": games,
                    })
                return {"status": Response.Success, "Users": users, "Count": users_count}
            
        return {"status": Response.NotExist}
    
    except Exception:
        return {"status": Response.UnSuccess}
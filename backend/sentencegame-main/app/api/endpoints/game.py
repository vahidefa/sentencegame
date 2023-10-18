from fastapi import APIRouter,Depends,Header,Query
import random
from app.schemas.game_models import GameForAdd
from app.api.dependencies.extensions import generate_id
from app.schemas.general_models import Response
from app.db.mongo import db
from app.api.dependencies.extensions import generate_id
from datetime import datetime
from app.ai.words import get_words


router = APIRouter()

def get_custom_header(token: str = Header(...)):
    return token

@router.get("/words")
async def fetch_words(token: str = Depends(get_custom_header)):
    try:
        user = db.db.users.find_one({"token": token})
        if user:
            words = get_words()
            if len(words)<20:
                return {"status": Response.Success, "Words": words}
            else:
                random_words = random.sample(words, 30)
            return {"status": Response.Success, "Words": random_words}
        
        return {"status": Response.AccessDenied}
    except Exception:
        return {"status": Response.UnSuccess}

@router.post("/game")
async def add_game_result(game_for_add: GameForAdd, token: str = Depends(get_custom_header)):
    try:
        user = db.db.users.find_one({"token": token})
        if user:
            now=datetime.now()
            sentences=[]
            sentence_ids=[]
            for item in game_for_add.sentences:
                if item:
                    sentence_id=generate_id()
                    sentence_ids.append(sentence_id)
                    sentences.append({
                    "_id": sentence_id,
                    "content": item,
                    "user_id": user["_id"],
                    "at": now,
                    "score":0,
                    "is_sent":False,
                   })
            game_id=generate_id()

            db.db.games.insert_one({
                "_id": game_id,
                "user_id": user["_id"],
                "at": now,
                "sentence_ids": sentence_ids,
            })
            
            db.db.sentences.insert_many(sentences)
            
            return {"status": Response.Success}
        
        return {"status": Response.NotExist}
    
    except Exception:
        return {"status": Response.UnSuccess}
    
@router.get("/scores")
async def get_scores_list(token: str = Depends(get_custom_header), skip: int = Query(..., description="skip"), limit: int = Query(..., description="limit")):
    try:
        user = db.db.users.find_one({"token": token})
        if user:
            users = []
            users_cursor = db.db.users.find({}).skip(skip).limit(limit)
            users_count = db.db.users.count_documents({})
            for user in users_cursor:
                acceptedSentences = db.db.games.count_documents(
                {"user_id": user["_id"], "score": {"$gte": 4}})
                participation = db.db.sentences.count_documents(
                {"user_id": user["_id"]})
                users.append({
                    "id": user["_id"],
                    "username": user["username"],
                    "score": acceptedSentences+participation,
                    "assessor_score":user["assessor_score"]
                })
            sorted_users = sorted(users, key=lambda x: x["score"], reverse=True)

            return {"status": Response.Success, "Users": sorted_users, "Count": users_count}
            
        return {"status": Response.NotExist}
    
    except Exception:
        return {"status": Response.UnSuccess}
from fastapi import APIRouter,Depends,Query,Body,Header
from app.schemas.user_models import User_Type
from app.schemas.general_models import Response
from app.db.mongo import db
from app.schemas.sentence_models import Determine_Sentence
from typing import List
from pymongo import ReturnDocument
from app.ai.accepted_sentences import set_sentences

router = APIRouter()

def get_custom_header(token: str = Header(...)):
    return token

@router.get("/sentence/assessor")
async def get_sentences_list_for_assessor(token: str = Depends(get_custom_header),skip:int=Query(...,description="skip"),limit:int=Query(...,description="limit")):
    try:
        user = db.db.users.find_one({"token": token})
        if user:
            if user["type"]==User_Type.Assessor.value:
                sentences_cursor = db.db.sentences.find({"score":0}).skip(skip).limit(limit)
                sentences_count = db.db.sentences.count_documents({"score":0})
                sentences=[]
                for sentence in sentences_cursor:
                    sentences.append({
                    "id":sentence["_id"],
                    "content":sentence["content"]
                    })
                return {"status": Response.Success, "Sentences": sentences,"Count":sentences_count}
        else:
            return {"status": Response.AccessDenied}
        
        return {"status": Response.NotExist}
    except Exception:
        return {"status": Response.UnSuccess}
      
@router.put("/sentence/determine")
async def determine_sentences(token: str = Depends(get_custom_header),sentences: List[Determine_Sentence] = Body(...)):
    try:
        user = db.db.users.find_one({"token": token})
        
        if user:
            if user["type"]==User_Type.Assessor.value:  
                have_change=False  
                for sentence in sentences:
                    sentence_after_update=db.db.sentences.find_one_and_update({"_id":sentence.id,"score":0}, {"$set": {"score": sentence.score}},return_document=ReturnDocument.AFTER)
                    if sentence_after_update:
                        if sentence.score>=4:
                            set_sentences(sentence)
                        have_change=True
                        sentence_user_id=sentence_after_update["user_id"]
                        user_accepted_sentence_count = db.db.sentences.count_documents({"user_id": sentence_user_id, "score": {"$gte": 4}})
                        if user_accepted_sentence_count>=50:
                            user_rejected_sentence_count=db.db.sentences.count_documents({"user_id": sentence_user_id,"score": {"$lte": 4}})
                            correct_ratio=user_accepted_sentence_count/(user_rejected_sentence_count+user_accepted_sentence_count)
                            if correct_ratio>0.8:
                                db.db.users.update_one({"_id":sentence_user_id}, {"$set": {"type": User_Type.Assessor.value}})
                if have_change==True:
                    db.db.users.update_one({"_id":user["_id"]},  {"$inc": {"assessor_score": 1}})
                return {"status": Response.Success}
            else:
                return {"status": Response.AccessDenied}
        
        return {"status": Response.NotExist}
    
    except Exception:
        return {"status": Response.UnSuccess}
 
@router.get("/sentence/total")
async def get_sentences_list(token: str = Depends(get_custom_header),skip:int=Query(...,description="skip"),limit:int=Query(...,description="limit")):
    try:
        user = db.db.users.find_one({"token": token})
        
        if user:
            if user["type"]==User_Type.Assessor.value:
                sentences_cursor = db.db.sentences.find({}).sort("at", -1).skip(skip).limit(limit)
                sentences_count = db.db.sentences.count_documents({})
                sentences=[]
                for sentence in sentences_cursor:
                    sentence_user=db.db.users.find_one({"_id": sentence["user_id"]})
                    sentences.append({
                    "id":sentence["_id"],
                    "content":sentence["content"],
                    "user_name":sentence_user["username"]
                   })
                return {"status": Response.Success, "Sentences": sentences,"Count":sentences_count}
            else:
                sentences_cursor = db.db.sentences.find({"user_id":user["_id"]}).sort("at", -1).skip(skip).limit(limit)
                sentences_count = db.db.sentences.count_documents({"user_id":user["_id"]})
                sentences=[]
                for sentence in sentences_cursor:
                    sentence_user=db.db.users.find_one({"_id": sentence["user_id"]})
                    sentences.append({
                    "id":sentence["_id"],
                    "content":sentence["content"],
                    "user_name":user["username"]
                   })
                return {"status": Response.Success, "Sentences": sentences,"Count":sentences_count}
        
        return {"status": Response.NotExist}
    except Exception:
         return {"status": Response.UnSuccess}
    
@router.get("/sentence/accepted")
async def get_sentences_list(token: str = Depends(get_custom_header),skip:int=Query(...,description="skip"),limit:int=Query(...,description="limit")):
    user = db.db.users.find_one({"token": token})
    if user:
        if user["type"]==User_Type.Assessor.value:
            sentences_cursor = db.db.sentences.find({"score": {"$gte": 4}}).skip(skip).limit(limit)
            sentences_count = db.db.sentences.count_documents({"score": {"$gte": 4}})
            sentences=[]
            for sentence in sentences_cursor:
                sentence_user=db.db.users.find_one({"_id": sentence["user_id"]})
                sentences.append({
                    "id":sentence["_id"],
                    "content":sentence["content"],
                    "user_name":sentence_user["username"]
                })
            return {"status": Response.Success, "Sentences": sentences,"Count":sentences_count}
        else:
            sentences_cursor = db.db.sentences.find({"user_id": user["_id"],"score": {"$gte": 4}}).skip(skip).limit(limit)
            sentences_count = db.db.sentences.count_documents({"user_id": user["_id"],"score": {"$gte": 4}})
            sentences=[]
            for sentence in sentences_cursor:
                sentences.append({
                    "id":sentence["_id"],
                    "content":sentence["content"]
                })
            return {"status": Response.Success, "Sentences": sentences,"Count":sentences_count}
        
    return {"status": Response.NotExist}


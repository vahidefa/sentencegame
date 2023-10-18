from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import router
from app.ai.accepted_sentences import set_sentences
from app.db.mongo import db

origins = [
    "http://localhost",
    "http://localhost:5000",  # آدرس مربوط به frontend شما
]

def get_application() -> FastAPI:
    application = FastAPI(title="Senteces Game")
    application.include_router(router)

    application.add_middleware(
         CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    sentences_cursor = db.db.sentences.find({"score": {"$gte": 4}})
    for sentence in sentences_cursor:
        set_sentences(sentence)
    
    return application

app =  get_application()



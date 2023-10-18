from fastapi import APIRouter
from app.api.endpoints.user import router as user_router
from app.api.endpoints.game import router as game_router
from app.api.endpoints.sentence import router as sentence_router


router = APIRouter()
router.include_router(user_router, tags=["user"])
router.include_router(game_router, tags=["game"])
router.include_router(sentence_router, tags=["sentence"])
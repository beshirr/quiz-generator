from fastapi import HTTPException, Request, APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json
from ..database.models import Challenge, get_db
from datetime import datetime
from ..database.db import *
from ..utils import *


router = APIRouter()


class ChallengeRequest(BaseModel):
    difficulty: str

    class Config:
        json_schema_extra = { "example": { "difficulty": "easy" } }


@router.post("/generate")
async def generate_challenge(request: ChallengeRequest, db: Session=Depends(get_db)):
    try:
        user_id = authenticate_and_get_user_details(request).get("user_id")
        quota = get_challenge_quota(db, user_id)

        if not quota:
            create_challeng_quota(db, user_id)

        quota = reset_quota_if_needed(db, quota)
        if quota.quota_remaining <= 0:
            raise HTTPException(status_code=429, detail="no available quota")

        challenge_details = None

        db.commit()
        return challenge_details
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/history")
async def history(request: Request, db: Session=Depends(get_db)):
    user_id = authenticate_and_get_user_details(request).get("user_id")
    challenges = get_user_challenges(db, user_id)

    return { "challenges": challenges } 


@router.get("/quota")
async def quota(request: Request, db: Session=Depends(get_db)):
    user_id = authenticate_and_get_user_details(request).get("user_id")
    quota = get_challenge_quota(db, user_id)

    if not quota:
        return {
            "user_id": user_id,
            "quota_remaining": 0, 
            "last_reset_date": datetime.now()
        }
    quota = reset_quota_if_needed(db, quota)
    return quota 


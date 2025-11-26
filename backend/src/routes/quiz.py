from fastapi import HTTPException, Request, APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json
from ..database.models import Challenge, get_db
from datetime import datetime
from ..database.db import *
from ..utils import *
from ..ai_generator import generate_challenge_with_ai


router = APIRouter()


class ChallengeRequest(BaseModel):
    difficulty: str

    class Config:
        json_schema_extra = { "example": { "difficulty": "easy" } }


@router.post("/generate")
async def generate_challenge(request: ChallengeRequest, request_obj: Request, db: Session=Depends(get_db)):
    try:
        user_id = authenticate_and_get_user_details(request_obj).get("user_id")
        quota = get_challenge_quota(db, user_id)

        if not quota:
            create_challeng_quota(db, user_id)

        quota = reset_quota_if_needed(db, quota)
        if quota.quota_remaining <= 0:
            raise HTTPException(status_code=429, detail="no available quota")

        challenge_data = generate_challenge_with_ai(request.difficulty)

        new_challenge = create_challenge(
            db=db,
            difficulty=request.difficulty,
            created_by=user_id,
            title=challenge_data["title"],
            options=json.dumps(challenge_data["options"]),
            correct_answer_id=challenge_data["correct_answer_id"],
            explanation=challenge_data["explanation"]
        )

        quota.quota_remaining -= 1
        db.commit()

        return {
            "id": new_challenge.id,
            "difficulty": request.difficulty,
            "title": new_challenge.title,
            "options": json.loads(new_challenge.options),
            "correct_answer_id": new_challenge.correct_answer_id,
            "explanation": new_challenge.explanation,
            "timestamp": new_challenge.date_created.isoformat()
        }
            
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


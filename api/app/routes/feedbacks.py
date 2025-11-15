from fastapi import APIRouter, HTTPException

from app.dependencies import SessionDep
from app.models.feedback import Feedback, FeedbackCreate, FeedbackPublic

router = APIRouter(prefix="/feedbacks", tags=["feedbacks"])


@router.post("", response_model=FeedbackPublic, status_code=201)
def create_feedback(feedback: FeedbackCreate, session: SessionDep):
    try:
        db_feedback = Feedback(
            name=feedback.name,
            message=feedback.message,
            rating=feedback.rating,
        )
        session.add(db_feedback)
        session.commit()
        session.refresh(db_feedback)
        return FeedbackPublic.model_validate(db_feedback)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=500, detail=f"Failed to create feedback: {str(e)}"
        )

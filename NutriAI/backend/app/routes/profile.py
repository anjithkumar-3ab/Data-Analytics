from fastapi import APIRouter

from app.schemas.profile_schema import HealthProfile
from app.services.profile_service import save_profile

router = APIRouter(
    prefix="/profile",
    tags=["Health Profile"]
)


@router.post("/")
def create_profile(profile: HealthProfile):
    return save_profile(profile)
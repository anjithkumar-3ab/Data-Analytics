from sqlalchemy.orm import Session
from .models import User
from .security import SecurityService

class AuthService:
    def __init__(self):
        self.security = SecurityService()

    def register_user(self, db: Session, username: str, email: str, password: str, role: str = 'user') -> User:
        user = User(
            username=username,
            email=email,
            password_hash=self.security.hash_password(password),
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def authenticate(self, db: Session, username: str, password: str) -> User | None:
        user = db.query(User).filter_by(username=username).first()
        if not user:
            return None
        if not self.security.verify_password(password, user.password_hash):
            return None
        return user

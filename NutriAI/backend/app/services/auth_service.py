from app.database.database import users_collection
from app.utils.security import hash_password
from app.utils.security import verify_password, create_access_token


def register_user(user):
    existing = users_collection.find_one({"email": user.email})

    if existing:
        return {
            "success": False,
            "message": "Email already exists"
        }

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    }

    users_collection.insert_one(new_user)

    return {
        "success": True,
        "message": "User Registered Successfully"
    }

def login_user(user):

    existing = users_collection.find_one(
        {"email": user.email}
    )

    if not existing:
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    if not verify_password(
        user.password,
        existing["password"]
    ):
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    token = create_access_token(
        {
            "sub": existing["email"]
        }
    )

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer"
    }
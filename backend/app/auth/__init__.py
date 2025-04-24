from typing import Annotated

from app.db import get_users_db
from app.db.crud import UserCRUD

from .schema import CreateUser, CoreUserOutput, UserResponse

from appwrite.exception import AppwriteException

from fastapi import APIRouter, Depends, HTTPException, status


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get(
    "/user/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=UserResponse,
)
def get_user(
    user_id: str,
    db: Annotated[UserCRUD, Depends(get_users_db)],
):
    try:
        result = db.get_one(user_id)
        return UserResponse(
            code=status.HTTP_200_OK,
            data=CoreUserOutput(
                userID=result["$id"],
                **result,
            ),
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message,
        )


@router.post(
    "/user/register",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
)
def create_user(
    user: CreateUser,
    db: Annotated[UserCRUD, Depends(get_users_db)],
):
    try:
        result = db.create_one(user.model_dump())
        return UserResponse(
            code=status.HTTP_201_CREATED,
            data=CoreUserOutput(
                userID=result["$id"],
                **result,
            ),
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=e.message,
        )

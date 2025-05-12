from typing import Annotated
from app.db import get_doctor_db
from app.db.crud import CRUD

from .schema import DoctorItem
from .response import DoctorListResponse, GetDoctorResponse


from appwrite.exception import AppwriteException

from fastapi import APIRouter, Depends, HTTPException, status
from ...auth import get_current_user

router = APIRouter(prefix="/doctor", tags=["Doctors"], dependencies=[Depends(get_current_user)])


@router.get(
    "/list",
    status_code=status.HTTP_200_OK,
    response_model=DoctorListResponse,
)
def doctors_list(db: Annotated[CRUD, Depends(get_doctor_db)]):
    try:
        response = db.get_multiple()

        data = [
            DoctorItem(
                name=item["name"],
                avatarIcon=item["avatarIcon"],
                id=item["$id"],
            )
            for item in response["documents"]
        ]

        return DoctorListResponse(
            code=status.HTTP_200_OK,
            data=data,
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message,
        )


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=GetDoctorResponse,
)
def get_doctor(id: str, db: Annotated[CRUD, Depends(get_doctor_db)]):
    try:
        result = db.get_one(id)

        data = DoctorItem(
            name=result["name"],
            avatarIcon=result["avatarIcon"],
            id=result["$id"],
        )

        return GetDoctorResponse(
            code=status.HTTP_200_OK,
            data=data,
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor doesn't exist.",
        )

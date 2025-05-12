from typing import Annotated

from app.db import create_file_url, get_patient_db, get_storage_db
from app.db.crud import CRUD, StorageCRUD

from .schema import CreatePatient, PatientOutputData, UploadOutputData
from .response import CreatePatientResponse, PostUploadResponse

from appwrite.exception import AppwriteException
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.input_file import InputFile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from ...auth import get_current_user

router = APIRouter(prefix="/patient", tags=["Patients"], dependencies=[Depends(get_current_user)])


@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
    response_model=PostUploadResponse,
    operation_id="PatientUpload",
)
async def upload_file(
    db: Annotated[StorageCRUD, Depends(get_storage_db)],
    file: UploadFile = File(..., description="The file to upload."),
):
    try:
        content = await file.read()

        response = db.create_one(
            file=InputFile.from_bytes(bytes=content, filename=file.filename),
            permissions=[
                Permission.read(Role.team(id="admin")),
                Permission.write(Role.team(id="admin")),
            ],
        )

        return PostUploadResponse(
            code=status.HTTP_201_CREATED,
            data=UploadOutputData(
                id=response["$id"],
            ),
        )

    except AppwriteException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.message,
        )


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=CreatePatientResponse,
)
async def create_patient(
    patient: CreatePatient,
    file_db: Annotated[StorageCRUD, Depends(get_storage_db)],
    patient_db: Annotated[CRUD, Depends(get_patient_db)],
):
    try:
        file_id = patient.identificationDocumentId
        url = create_file_url(file_id)

        data = patient.model_dump()
        data["identificationDocumentUrl"] = url
        data.pop("userId")

        _ = file_db.update_one(
            id=file_id,
            permissions=[
                Permission.read(Role.user(id=patient.userId)),
                Permission.write(Role.user(id=patient.userId)),
            ],
        )

        response = patient_db.create_one(
            data=data,
            permissions=[
                Permission.read(Role.user(id=patient.userId)),
                Permission.write(Role.user(id=patient.userId)),
                Permission.read(Role.team(id="admin")),
                Permission.write(Role.team(id="admin")),
            ],
        )

        return CreatePatientResponse(
            code=status.HTTP_201_CREATED,
            data=PatientOutputData(id=response["$id"]),
        )

    except AppwriteException as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A patient already exists with these details.",
        )

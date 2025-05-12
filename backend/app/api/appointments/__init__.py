from typing import Annotated

from app.api.patients.schema import PatientItem
from app.api.responses.messages import HTTP_ERROR_404, HTTP_ERROR_409
from app.db import get_appointment_db

from app.api.doctors.schema import DoctorItem
from app.db.crud import CRUD

from .schema import (
    CancelAppointment,
    AppointmentCountsData,
    AppointmentItemData,
    AppointmentIdData,
    CreateAppointment,
    GetAppointmentData,
    GetSuccessDetails,
    ScheduleAppointment,
)

from .response import (
    GetAppointmentResponse,
    GetAppointmentSuccessDetailsResponse,
    GetRecentAppointmentsResponse,
    AppointmentIdResponse,
)

from appwrite.exception import AppwriteException
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.query import Query

from fastapi import APIRouter, Depends, HTTPException, status
from ...auth import get_current_user


router = APIRouter(prefix="/appointment", tags=["Appointments"], dependencies=[Depends(get_current_user)])


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model=AppointmentIdResponse,
    responses=HTTP_ERROR_409,
)
def create_appointment(
    appointment: CreateAppointment,
    db: Annotated[CRUD, Depends(get_appointment_db)],
):
    try:
        response = db.create_one(
            data=appointment.model_dump(),
            permissions=[
                Permission.read(Role.user(id=appointment.userId)),
                Permission.write(Role.user(id=appointment.userId)),
                Permission.read(Role.team(id="admin")),
                Permission.write(Role.team(id="admin")),
            ],
        )

        return AppointmentIdResponse(
            code=status.HTTP_201_CREATED,
            data=AppointmentIdData(
                id=response["$id"],
            ),
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An appointment already exists with these details.",
        )


@router.get(
    "/list",
    status_code=status.HTTP_200_OK,
    response_model=GetRecentAppointmentsResponse,
    responses=HTTP_ERROR_404,
)
def get_recent_appointments(db: Annotated[CRUD, Depends(get_appointment_db)]):
    try:
        appointments = db.get_multiple(queries=[Query.order_desc("$createdAt")])
        scheduled = db.get_multiple(
            queries=[
                Query.equal("status", "scheduled"),
                Query.select("$id"),
            ]
        )
        pending = db.get_multiple(
            queries=[
                Query.equal("status", "pending"),
                Query.select("$id"),
            ]
        )
        cancelled = db.get_multiple(
            queries=[
                Query.equal("status", "cancelled"),
                Query.select("$id"),
            ]
        )

        appointments = [
            AppointmentItemData(
                id=appointment["$id"],
                reason=appointment["reason"],
                notes=appointment["notes"],
                schedule=appointment["schedule"],
                status=appointment["status"],
                cancellationReason=appointment["cancellationReason"],
                userId=appointment["userId"],
                patient=PatientItem(
                    id=appointment["patient"]["$id"],
                    name=appointment["patient"]["name"],
                ),
                physician=DoctorItem(
                    id=appointment["primaryPhysician"]["$id"],
                    name=appointment["primaryPhysician"]["name"],
                    avatarIcon=appointment["primaryPhysician"]["avatarIcon"],
                ),
            )
            for appointment in appointments["documents"]
        ]

        data = AppointmentCountsData(
            scheduledCount=len(scheduled["documents"]),
            pendingCount=len(pending["documents"]),
            cancelledCount=len(cancelled["documents"]),
            appointments=appointments,
        )

        return GetRecentAppointmentsResponse(
            code=status.HTTP_200_OK,
            data=data,
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointments cannot be found.",
        )


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=GetAppointmentResponse,
    responses=HTTP_ERROR_404,
)
def get_appointment(id: str, db: Annotated[CRUD, Depends(get_appointment_db)]):
    try:
        response = db.get_one(id)

        patient = response["patient"]
        doctor = DoctorItem(
            **response["primaryPhysician"],
            id=response["primaryPhysician"]["$id"],
        )
        core_data: dict = response
        core_data.pop("patient")

        data = GetAppointmentData(
            **core_data,
            id=response["$id"],
            doctor=doctor,
            patient=patient["$id"],
        )

        return GetAppointmentResponse(
            code=status.HTTP_200_OK,
            data=data,
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment doesn't exist.",
        )


@router.get(
    "/{id}/success",
    status_code=status.HTTP_200_OK,
    response_model=GetAppointmentSuccessDetailsResponse,
    responses=HTTP_ERROR_404,
)
def get_success_details(id: str, db: Annotated[CRUD, Depends(get_appointment_db)]):
    try:
        response = db.get_one(id)
        doctor = DoctorItem(
            **response["primaryPhysician"],
            id=response["primaryPhysician"]["$id"],
        )

        data = GetSuccessDetails(
            id=response["$id"],
            doctor=doctor,
            schedule=response["schedule"],
        )

        return GetAppointmentSuccessDetailsResponse(
            code=status.HTTP_200_OK,
            data=data,
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment doesn't exist.",
        )


@router.patch(
    "/cancel",
    status_code=status.HTTP_200_OK,
    response_model=AppointmentIdResponse,
    responses=HTTP_ERROR_404,
)
def cancel_appointment(
    details: CancelAppointment, db: Annotated[CRUD, Depends(get_appointment_db)]
):
    try:
        response = db.update_one(
            details.id,
            data={
                "cancellationReason": details.cancellationReason,
                "status": details.status,
            },
        )

        return AppointmentIdResponse(
            code=status.HTTP_200_OK,
            data=AppointmentIdData(id=response["$id"]),
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment doesn't exist.",
        )


@router.patch(
    "/schedule",
    status_code=status.HTTP_200_OK,
    response_model=AppointmentIdResponse,
    responses=HTTP_ERROR_404,
)
def schedule_appointment(
    details: ScheduleAppointment, db: Annotated[CRUD, Depends(get_appointment_db)]
):
    try:
        data = details.model_dump()
        data.pop("id")

        response = db.update_one(
            details.id,
            data=data,
        )

        return AppointmentIdResponse(
            code=status.HTTP_200_OK,
            data=AppointmentIdData(id=response["$id"]),
        )

    except AppwriteException as e:
        print(e.message)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment doesn't exist.",
        )

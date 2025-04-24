from datetime import datetime

from app.api.appointments.enums import Status
from app.api.doctors.schema import DoctorItem

from app.api.patients.schema import PatientItem
from pydantic import BaseModel, ConfigDict, Field, field_validator


class AppointmentBase(BaseModel):
    """A base model for common appointment fields."""

    reason: str = Field(..., description="The reason for the appointment.")
    notes: str = Field(..., description="Additional notes related to the appointment.")
    schedule: str = Field(
        ...,
        description="The date and time of the appointment. Format: dd/mm/yyyy, hh:mm:ss",
    )
    status: Status = Field(..., description="The status of the appointment.")
    cancellationReason: str | None = Field(
        None, description="The reason for cancelling the appointment (optional)."
    )
    patient: str = Field(
        ..., description="The ID of the patient assigned to the appointment."
    )
    userId: str = Field(
        ..., description="The ID of the user assigned to the appointment."
    )

    model_config = ConfigDict(use_enum_values=True)

    @field_validator("schedule")
    def validate_schedule(cls, schedule: str) -> str:
        return datetime.fromisoformat(schedule).isoformat()


class CreateAppointment(AppointmentBase):
    """A model for creating an appointment."""

    primaryPhysician: str = Field(
        ..., description="The ID of the doctor assigned to the appointment."
    )


class AppointmentIdData(BaseModel):
    """The output data containing the appointments ID."""

    id: str = Field(..., description="The id of the appointment.")


class GetAppointmentData(AppointmentBase, AppointmentIdData):
    """The output data for getting a single appointment."""

    doctor: DoctorItem = Field(
        ..., description="The details of the doctor assigned to the appointment."
    )
    schedule: str = Field(
        ...,
        description="The date and time of the appointment. Format required: ISO.",
    )

    @field_validator("schedule")
    def validate_schedule(cls, schedule: str) -> datetime:
        return datetime.fromisoformat(schedule)


class GetSuccessDetails(AppointmentIdData):
    """The output data for successfully getting the success appointment details."""

    doctor: DoctorItem = Field(
        ..., description="The details of the doctor assigned to the appointment."
    )
    schedule: str | datetime = Field(
        ...,
        description="The date and time of the appointment. Format required: ISO.",
    )


class AppointmentItemData(BaseModel):
    """The core appointment information."""

    id: str = Field(..., description="The id of the appointment.")
    reason: str = Field(..., description="The reason for the appointment.")
    notes: str = Field(..., description="Additional notes related to the appointment.")
    schedule: str = Field(
        ...,
        description="The date and time of the appointment. Format: dd/mm/yyyy, hh:mm:ss",
    )
    status: Status = Field(..., description="The status of the appointment.")
    cancellationReason: str | None = Field(
        None, description="The reason for cancelling the appointment (optional)."
    )
    userId: str = Field(
        ..., description="The ID of the user assigned to the appointment."
    )
    patient: PatientItem = Field(
        ..., description="The core patient information assigned to the appointment."
    )
    physician: DoctorItem = Field(
        ..., description="The core doctor information assigned to the appointment."
    )

    model_config = ConfigDict(use_enum_values=True)

    @field_validator("schedule")
    def validate_schedule(cls, schedule: str) -> datetime:
        return datetime.fromisoformat(schedule)


class AppointmentCountsData(BaseModel):
    """The output data for appointment counts."""

    scheduledCount: int
    pendingCount: int
    cancelledCount: int
    appointments: list[AppointmentItemData]


class CancelAppointment(BaseModel):
    """A model for cancelling an appointment."""

    id: str = Field(..., description="The id of the appointment.")
    cancellationReason: str = Field(
        ..., description="The reason for cancelling the appointment."
    )
    status: Status = Field(..., description="The status of the appointment.")


class ScheduleAppointment(BaseModel):
    """A model for scheduling an appointment."""

    id: str = Field(..., description="The id of the appointment.")
    primaryPhysician: str = Field(
        ..., description="The ID of the doctor assigned to the appointment."
    )
    reason: str = Field(..., description="The reason for the appointment.")
    notes: str | None = Field(
        None, description="Additional notes related to the appointment."
    )
    schedule: str = Field(
        ...,
        description="The date and time of the appointment. Format: dd/mm/yyyy, hh:mm:ss",
    )
    status: Status = Field(..., description="The status of the appointment.")

    @field_validator("schedule")
    def validate_schedule(cls, schedule: str) -> str:
        return datetime.fromisoformat(schedule).isoformat()

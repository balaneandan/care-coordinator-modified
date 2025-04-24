from datetime import datetime
from typing import Optional

from .enums import Gender, IdentificationTypes

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PatientBase(BaseModel):
    """A base patient model with common fields."""

    userId: str = Field(..., description="The user ID associated with the patient.")
    name: str = Field(..., description="The name of the patient.")
    email: str = Field(..., description="The email of the patient.")
    phone: str = Field(..., description="The contact number of the patient.")
    birthDate: str = Field(
        ...,
        description="The birth date of the patient in the format: 'dd MMMM yyyy' -> e.g., 14 July 2024.",
    )
    gender: Gender = Field(..., description="The gender of the patient.")
    address: str = Field(..., description="The address of the patient.")
    occupation: str = Field(..., description="The occupation of the patient.")
    emergencyContactName: str = Field(
        ..., description="The name of the emergency contact."
    )
    emergencyContactNumber: str = Field(
        ..., description="The phone number of the emergency contact."
    )
    primaryPhysician: str = Field(
        ..., description="The name of the patients primary physician."
    )
    insuranceProvider: str = Field(
        ..., description="The name of the patients insurance provider."
    )
    insurancePolicyNumber: str = Field(
        ..., description="The patients insurance policy number."
    )
    allergies: Optional[str] = Field(
        None, description="Any known allergies of the patient."
    )
    currentMedication: Optional[str] = Field(
        None, description="Current medications the patient is taking."
    )
    familyMedicalHistory: Optional[str] = Field(
        None, description="Family medical history of the patient."
    )
    identificationType: Optional[IdentificationTypes] = Field(
        None, description="The type of identification document."
    )
    identificationNumber: Optional[str] = Field(
        None, description="The identification number of the document."
    )
    identificationDocumentId: Optional[str] = Field(
        None, description="The ID of the identification document."
    )
    treatmentConsent: bool = Field(..., description="Consent for treatment.")
    disclosureConsent: bool = Field(
        ..., description="Consent for disclosure of medical information."
    )
    privacyConsent: bool = Field(..., description="Consent for privacy policy.")

    model_config = ConfigDict(use_enum_values=True)

    @field_validator("birthDate")
    def validate_schedule(cls, birth_date: str) -> str:
        birth_date_obj = datetime.fromisoformat(birth_date)
        return birth_date_obj.isoformat()
        #return datetime(birth_date).isoformat()


class CreatePatient(PatientBase):
    """A model for creating a patient."""

    pass


class PatientOutputData(BaseModel):
    """The output data for the created patient."""

    id: str = Field(..., description="The id of the created patient.")


class UploadOutputData(BaseModel):
    """The output data for the patient file upload."""

    id: str = Field(..., description="The id of the created file.")


class PatientItem(BaseModel):
    """The core patient data."""

    name: str = Field(..., description="The name of the patient.")
    id: str = Field(..., description="The id of the patient.")

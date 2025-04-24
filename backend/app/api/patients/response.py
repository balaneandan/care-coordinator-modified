from app.api.responses import SuccessResponse

from app.api.patients.schema import PatientOutputData, UploadOutputData


class CreatePatientResponse(SuccessResponse[PatientOutputData]):
    """The response for creating a patient."""

    pass


class PostUploadResponse(SuccessResponse[UploadOutputData]):
    """The response for patient file uploads."""

    pass

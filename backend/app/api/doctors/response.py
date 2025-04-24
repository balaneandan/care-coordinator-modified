from app.api.responses import SuccessResponse
from app.api.doctors.schema import DoctorItem


class DoctorListResponse(SuccessResponse[list[DoctorItem]]):
    """A response for getting a list of doctors."""

    pass


class GetDoctorResponse(SuccessResponse[DoctorItem]):
    """A response for getting a single doctor."""

    pass

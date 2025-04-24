from app.api.appointments.schema import (
    AppointmentCountsData,
    AppointmentIdData,
    GetAppointmentData,
    GetSuccessDetails,
)

from app.api.responses import SuccessResponse


class AppointmentIdResponse(SuccessResponse[AppointmentIdData]):
    """A response for returning the appointment ID."""

    pass


class GetAppointmentResponse(SuccessResponse[GetAppointmentData]):
    """The response for getting a single appointment."""

    pass


class GetAppointmentSuccessDetailsResponse(SuccessResponse[GetSuccessDetails]):
    """The response for getting the success appointment details."""

    pass


class GetRecentAppointmentsResponse(SuccessResponse[AppointmentCountsData]):
    """The response for getting recent appointments."""

    pass

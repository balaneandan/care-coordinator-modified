from pydantic import BaseModel


class DoctorBase(BaseModel):
    """A base doctor model with common fields."""

    name: str


class DoctorItem(DoctorBase):
    """A data model for a single doctor item."""

    avatarIcon: str
    id: str

from app.api.responses import SuccessResponse

from pydantic import BaseModel, Field


class UserBase(BaseModel):
    """A base user model with common fields."""

    name: str = Field(..., description="The name of the user.")
    email: str = Field(..., description="The email of the user.")
    phone: str = Field(..., description="The contact number of the user.")


class CreateUser(UserBase):
    """A user model for creating a user."""

    pass


class CoreUserOutput(UserBase):
    """The user details output."""

    userID: str = Field(..., description="The ID of the user.")


class UserResponse(SuccessResponse):
    """The response received by creating and retrieving the user."""

    data: CoreUserOutput

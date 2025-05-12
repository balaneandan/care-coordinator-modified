from app.api.responses import SuccessResponse

from pydantic import BaseModel, Field


class UserBase(BaseModel):
    """A base user model with common fields."""

    name: str = Field(..., description="The name of the user.")
    email: str = Field(..., description="The email of the user.")
    phone: str = Field(..., description="The contact number of the user.")
    password: str = Field(..., description="The password of the user.")


class CreateUser(UserBase):
    """A user model for creating a user."""

    pass


class CoreUserOutput(UserBase):
    """The user details output."""

    userID: str = Field(..., description="The ID of the user.")


class UserResponse(SuccessResponse):
    """The response received by creating and retrieving the user."""

    data: CoreUserOutput

class LoginRequest(BaseModel):
    email: str
    password: str

class EmailRequest(BaseModel):
    email: str

class MFAChallengeRequest(BaseModel):
    factor: str

class MFAVerifyRequest(BaseModel):
    challengeId: str
    otp: str
    session_token: str

class EmailVerification(BaseModel):
    userId: str
    secret: str
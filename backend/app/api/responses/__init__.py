from typing import Generic, TypeVar

from pydantic import BaseModel, Field, ValidationInfo, field_validator, validate_call
from fastapi import status as fastapiStatus


T = TypeVar("T", bound=BaseModel)


@validate_call
def build_response(code: int, no_strip: bool = False) -> str:
    """A utility function for building a string representation of a response code."""
    for item in fastapiStatus.__all__:
        if str(code) in item:
            if no_strip:
                return item

            return item.lstrip("HTTP_")

    raise ValueError(
        f"'{code}' isn't a valid HTTP response code! Try 'fastapi.status' for a list of valid response codes"
    )


@validate_call
def get_code_status(code: int) -> str:
    """A utility function for retrieving the code status based on the code."""
    # Validate code exists
    _ = build_response(code)

    code_type_map = {
        "info": range(100, 200),
        "success": range(200, 300),
        "redirect": range(300, 400),
        "error": range(400, 600),
    }

    for key, code_range in code_type_map.items():
        if code in code_range:
            return key


class BaseResponse(BaseModel):
    """A base request model for API responses. Intended for client responses."""

    status: str = Field(
        ...,
        description="The status of the response.",
    )
    code: int = Field(..., description="The HTTP response code.")
    response: str | None = Field(
        default=None,
        frozen=True,
        validate_default=True,
        description="The description for the type of HTTP response. Created dynamically. Cannot be assigned manually.",
    )

    @field_validator("response")
    def validate_code(cls, _: str, info: ValidationInfo) -> str:
        code: int = info.data.get("code")
        return build_response(code)


class BaseSuccessResponse(BaseResponse):
    """A base request model for successful API responses. Intended for client responses."""

    status: str = Field(
        default="success",
        frozen=True,
        description="The status of the response. Cannot be changed.",
    )
    data: BaseModel = Field(..., description="The response data.")
    headers: dict[str, str] | None = Field(
        default=None, description="The headers to send with the response (optional)."
    )


class MessageResponse(BaseResponse):
    """A message response model for API responses. Intended for client responses."""

    message: str = Field(..., description="The reason the response occured.")
    headers: dict[str, str] | None = Field(
        default=None, description="The headers to send with the response (optional)."
    )


class ErrorResponse(MessageResponse):
    """An error response model. Intended for client responses."""

    status: str = Field(
        default="error",
        frozen=True,
        description="The status of the response. Cannot be changed.",
    )


class SuccessResponse(BaseSuccessResponse, Generic[T]):
    """A success response model. Intended for client responses. Uses generics to change the data model."""

    data: T

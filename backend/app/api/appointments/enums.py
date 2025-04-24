from enum import StrEnum


class Status(StrEnum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    CANCELLED = "cancelled"

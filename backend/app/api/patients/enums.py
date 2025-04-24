from enum import StrEnum


class Gender(StrEnum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"


class IdentificationTypes(StrEnum):
    BIRTH_CERT = "Birth Certificate"
    DRIVERS_LICENSE = "Driver's License"
    MED_INSURANCE_CARD = "Medical Insurance Card/Policy"
    MILITARY_ID = "Military ID Card"
    IDENTITY_CARD = "National Identity Card"
    PASSPORT = "Passport"
    GREEN_CARD = "Resident Alien Card (Green Card)"
    SOCIAL_SEC_CARD = "Social Security Card"
    STATE_ID_CARD = "State ID Card"
    STUDENT_ID_CARD = "Student ID Card"
    VOTER_ID_CARD = "Voter ID Card"

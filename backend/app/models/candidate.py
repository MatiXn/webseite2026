"""
Pydantic-Modelle für Kandidaten-Daten.
Alle Felder haben explizite Längen- und Format-Validierungen.
Keine rohen Strings ohne Validierung.
"""
import re
from datetime import date
from enum import Enum
from typing import Annotated
from uuid import UUID

import phonenumbers
from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)


# ── Enums ──────────────────────────────────────────────────────────────────────

class JobType(str, Enum):
    full_time = "full_time"
    part_time = "part_time"
    contract = "contract"


class Category(str, Enum):
    elektrotechnik = "Elektrotechnik"
    mechatronik = "Mechatronik"
    it_automation = "IT / Automation"
    bau_tga = "Bau / TGA"
    other = "Sonstiges"


class CandidateStatus(str, Enum):
    active = "active"
    placed = "placed"
    inactive = "inactive"
    on_hold = "on_hold"


# ── Annotated Types ────────────────────────────────────────────────────────────

# Strikte Namens-Validierung: nur Buchstaben, Bindestrich, Apostroph, Leerzeichen
SafeName = Annotated[
    str,
    Field(min_length=1, max_length=100, pattern=r"^[\w\s\-'\.àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÄÖÜß]+$"),
]

PhoneStr = Annotated[str, Field(min_length=7, max_length=20)]

SalaryInt = Annotated[int, Field(ge=0, le=500_000)]

ShortText = Annotated[str, Field(max_length=500)]

LongText = Annotated[str, Field(max_length=5000)]


# ── Validators ─────────────────────────────────────────────────────────────────

def validate_phone(v: str) -> str:
    """E.164-Validierung via phonenumbers Library (keine Regex-Eigenbauten)."""
    try:
        parsed = phonenumbers.parse(v, "DE")
        if not phonenumbers.is_valid_number(parsed):
            raise ValueError("Invalid phone number")
        return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    except phonenumbers.NumberParseException as e:
        raise ValueError(f"Invalid phone number format: {e}") from e


# ── Request Models ──────────────────────────────────────────────────────────────

class CandidateCreate(BaseModel):
    first_name: SafeName
    last_name: SafeName
    email: EmailStr
    phone: PhoneStr
    birth_date: date | None = None
    category: Category
    job_type: JobType = JobType.full_time
    desired_salary_min: SalaryInt | None = None
    desired_salary_max: SalaryInt | None = None
    location: Annotated[str, Field(max_length=100)] | None = None
    willing_to_relocate: bool = False
    summary: ShortText | None = None
    skills: list[Annotated[str, Field(max_length=50)]] = Field(default_factory=list, max_length=30)
    years_experience: Annotated[int, Field(ge=0, le=60)] | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone_field(cls, v: str) -> str:
        return validate_phone(v)

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, v: str) -> str:
        return v.lower().strip()

    @field_validator("first_name", "last_name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        return v.strip()

    @model_validator(mode="after")
    def salary_range_valid(self) -> "CandidateCreate":
        if self.desired_salary_min and self.desired_salary_max:
            if self.desired_salary_min > self.desired_salary_max:
                raise ValueError("salary_min must be <= salary_max")
        return self

    @field_validator("skills")
    @classmethod
    def sanitize_skills(cls, v: list[str]) -> list[str]:
        # Deduplizieren und leere Strings entfernen
        seen = set()
        result = []
        for skill in v:
            clean = skill.strip()
            if clean and clean not in seen:
                seen.add(clean)
                result.append(clean)
        return result


class CandidateUpdate(BaseModel):
    """Alle Felder optional für PATCH-Requests."""
    first_name: SafeName | None = None
    last_name: SafeName | None = None
    phone: PhoneStr | None = None
    category: Category | None = None
    job_type: JobType | None = None
    desired_salary_min: SalaryInt | None = None
    desired_salary_max: SalaryInt | None = None
    location: Annotated[str, Field(max_length=100)] | None = None
    willing_to_relocate: bool | None = None
    summary: ShortText | None = None
    skills: list[Annotated[str, Field(max_length=50)]] | None = None
    status: CandidateStatus | None = None
    years_experience: Annotated[int, Field(ge=0, le=60)] | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone_field(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return validate_phone(v)


# ── Response Models (kein internes Datenleck) ──────────────────────────────────

class CandidateResponse(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    email: str
    phone: str
    category: Category
    job_type: JobType
    status: CandidateStatus
    desired_salary_min: int | None
    desired_salary_max: int | None
    location: str | None
    willing_to_relocate: bool
    skills: list[str]
    years_experience: int | None
    summary: str | None

    model_config = {"from_attributes": True}


class CandidateListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[CandidateResponse]


# ── File Upload ─────────────────────────────────────────────────────────────────

ALLOWED_MIME_TYPES = frozenset({"application/pdf", "application/msword",
                                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
ALLOWED_EXTENSIONS = frozenset({".pdf", ".doc", ".docx"})


# ── Pagination ─────────────────────────────────────────────────────────────────

class PaginationParams(BaseModel):
    page: Annotated[int, Field(ge=1, le=1000)] = 1
    page_size: Annotated[int, Field(ge=1, le=100)] = 20

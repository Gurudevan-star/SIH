import os
import hashlib
import secrets
from datetime import datetime, timezone


API_KEY = os.getenv("CRYPTOTRACE_API_KEY")


def verify_api_key(provided_key: str | None) -> bool:
    """
    Verify the API key using a constant-time comparison.
    """
    if not API_KEY or not provided_key:
        return False

    return secrets.compare_digest(provided_key, API_KEY)


def hash_value(value: str) -> str:
    """
    Create a SHA-256 hash for a given value.
    """
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def utc_now() -> datetime:
    """
    Return the current UTC timestamp.
    """
    return datetime.now(timezone.utc)
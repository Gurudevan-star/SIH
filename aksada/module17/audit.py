import json
import logging
from datetime import datetime, timezone


logger = logging.getLogger("cryptotrace.audit")


def audit_event(
    event_type: str,
    case_id: str | None = None,
    investigation_id: str | None = None,
    user_id: str | None = None,
    details: dict | None = None,
):
    """
    Record an auditable CryptoTrace event.
    """

    event = {
        "event_type": event_type,
        "case_id": case_id,
        "investigation_id": investigation_id,
        "user_id": user_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "details": details or {},
    }

    logger.info(json.dumps(event))

    return event
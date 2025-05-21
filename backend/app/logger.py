import logging
import json

# This module configures the logger for the application.
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "level": record.levelname,
            "message": record.getMessage(),
            "timestamp": self.formatTime(record, self.datefmt),
        }
        if hasattr(record, 'scan_id'):
            log_record["scan_id"] = record.scan_id
        return json.dumps(log_record)

# Setup logger
logger = logging.getLogger("ptbox")
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)
logger.setLevel(logging.INFO)

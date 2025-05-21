from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import json

Base = declarative_base()

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    finished_at = Column(DateTime)
    summary = Column(String)
    artifacts_json = Column(Text)
    raw_json = Column(Text)

    def to_dict(self):
        return {
            "id": self.id,
            "domain": self.domain,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "finished_at": self.finished_at.isoformat() if self.finished_at else None,
            "summary": json.loads(self.summary) if self.summary else None,
            "artifacts": json.loads(self.artifacts_json) if self.artifacts_json else None,
            "raw": json.loads(self.raw_json) if self.raw_json else None
        }
        
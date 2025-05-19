from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scanner import run_parallel_scans
from app.utils.helpers import parse_scan_results
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from app.db import get_db
from app.models.scan import Scan
from sqlalchemy import select
from fastapi import Path
import json
from fastapi.responses import StreamingResponse
from io import BytesIO
import openpyxl


router = APIRouter(prefix="/api")

class ScanRequest(BaseModel):
    domain: str

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/scan")
async def scan_domain(payload: ScanRequest, db: AsyncSession = Depends(get_db)):
    domain = payload.domain.strip().lower()

    if not domain or "." not in domain:
        raise HTTPException(status_code=400, detail="Invalid domain")

    started_at = datetime.utcnow()
    raw_results = await run_parallel_scans(domain)
    parsed = parse_scan_results(raw_results, domain)
    finished_at = datetime.utcnow()

    summary = {
        "subdomain_count": len(parsed["subdomains"]),
        "email_count": len(parsed["emails"])
    }

    scan = Scan(
        domain=domain,
        started_at=started_at,
        finished_at=finished_at,
        summary=json.dumps(summary),
        artifacts_json=json.dumps(parsed),
        raw_json=json.dumps(raw_results)
    )

    db.add(scan)
    await db.commit()
    await db.refresh(scan)

    return scan.to_dict()

@router.get("/scans")
async def get_all_scans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scan).order_by(Scan.started_at.desc()))
    scans = result.scalars().all()
    return [scan.to_dict() for scan in scans]


@router.get("/scan/{scan_id}")
async def get_scan(scan_id: int = Path(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scan).where(Scan.id == scan_id))
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    return scan.to_dict()


@router.get("/scan/{scan_id}/export")
async def export_scan(scan_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scan).where(Scan.id == scan_id))
    scan = result.scalar_one_or_none()

    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    try:
        # Parse stored JSON
        artifacts = json.loads(scan.artifacts_json)

        # Create Excel workbook
        wb = openpyxl.Workbook()
        subdomains = artifacts.get("subdomains", [])
        emails = artifacts.get("emails", [])

        # Sheet 1: Subdomains
        ws1 = wb.active
        ws1.title = "Subdomains"
        ws1.append(["Subdomain"])
        for sub in subdomains:
            ws1.append([sub])

        # Sheet 2: Emails
        if emails:
            ws2 = wb.create_sheet(title="Emails")
            ws2.append(["Email"])
            for email in emails:
                ws2.append([email])

        # Save to buffer
        buffer = BytesIO()
        wb.save(buffer)
        buffer.seek(0)

        filename = f"scan_{scan.id}_{scan.domain}.xlsx"
        return StreamingResponse(
            buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )

    except Exception as e:
        print("❌ Export error:", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate Excel file")

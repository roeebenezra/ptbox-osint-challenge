from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scanner import run_parallel_scans
from app.utils.helpers import parse_scan_results

router = APIRouter(prefix="/api")

class ScanRequest(BaseModel):
    domain: str

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/scan")
async def scan_domain(payload: ScanRequest):
    domain = payload.domain.strip().lower()

    if not domain or "." not in domain:
        raise HTTPException(status_code=400, detail="Invalid domain")

    raw_results = await run_parallel_scans(domain)
    parsed = parse_scan_results(raw_results, domain)

    return {
        "domain": domain,
        "summary": {
            "subdomain_count": len(parsed["subdomains"]),
            "email_count": len(parsed["emails"])
        },
        "artifacts": parsed,
        "raw": raw_results  # Optional: remove later for production
    }
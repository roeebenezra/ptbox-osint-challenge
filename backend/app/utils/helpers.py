import re
from typing import List, Dict

def extract_subdomains(output: str, domain: str) -> List[str]:
    pattern = rf"(?:[\w.-]+\.)?{re.escape(domain)}"
    matches = re.findall(pattern, output)
    return list(set(matches))

def extract_emails(output: str, domain: str) -> List[str]:
    pattern = rf"[a-zA-Z0-9_.+-]+@{re.escape(domain)}"
    matches = re.findall(pattern, output)
    return list(set(matches))

def parse_scan_results(results: List[Dict], domain: str) -> Dict:
    all_subdomains = []
    all_emails = []

    for result in results:
        output = result.get("stdout", "")
        all_subdomains += extract_subdomains(output, domain)
        all_emails += extract_emails(output, domain)

    return {
        "subdomains": sorted(set(all_subdomains)),
        "emails": sorted(set(all_emails)),
    }

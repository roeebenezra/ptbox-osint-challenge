import asyncio
from typing import Dict, Any

async def run_theharvester(domain: str) -> Dict[str, Any]:
    proc = await asyncio.create_subprocess_exec(
        "theHarvester",
        "-d", domain,
        "-b", "crtsh,anubis", # edited to use only crtsh and anubis, change it later if needed
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()

    return {
        "tool": "theHarvester",
        "stdout": stdout.decode(),
        "stderr": stderr.decode(),
        "returncode": proc.returncode
    }

async def run_amass(domain: str) -> Dict[str, Any]:
    proc = await asyncio.create_subprocess_exec(
        "amass",
        "enum",
        "-passive",
        "-d", domain,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()

    return {
        "tool": "amass",
        "stdout": stdout.decode(),
        "stderr": stderr.decode(),
        "returncode": proc.returncode
    }

async def run_parallel_scans(domain: str):
    harvester_task = asyncio.create_task(run_theharvester(domain))
    amass_task = asyncio.create_task(run_amass(domain))
    results = await asyncio.gather(harvester_task, amass_task)
    return results

# PTBOX OSINT Web Application

## 🚀 Project Overview

This is a self-contained OSINT web application built for the PTBOX development challenge. It allows users to run passive domain reconnaissance using **theHarvester** and **Amass**, view results in a React-based frontend, and export findings to Excel.

---

## ⚙️ Tech Stack

* **Backend**: Python 3, FastAPI, SQLAlchemy, SQLite
* **Frontend**: React (in progress)
* **Tools**: theHarvester, Amass
* **Packaging**: Docker, Docker Compose

---

## 📦 Quick Start (Three Commands)

```bash
git clone https://github.com/roeebenezra/ptbox-osint-challenge.git
cd ptbox-osint
docker compose up --build
```

Visit: [http://localhost:8000/docs](http://localhost:8000/docs) to test the API.

---

## 🧠 Features

* Accepts a domain name and runs theHarvester + Amass concurrently
* Deduplicates and structures OSINT results
* Saves all scans to SQLite for persistence
* Provides API endpoints:

  * `POST /api/scan` – Run a scan
  * `GET /api/scans` – List all scans
  * `GET /api/scan/{id}` – View scan details
  * `GET /api/scan/{id}/export` – Download results as Excel
* JSON logging, safe subprocess usage, and Dockerized


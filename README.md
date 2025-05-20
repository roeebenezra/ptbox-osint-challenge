# PTBOX OSINT Scanner

A full-stack web application for passive open-source intelligence gathering using domain scans. Built as part of a development challenge, this project integrates a FastAPI backend and a React-based frontend with Dockerized deployment.

---

## 🔍 Features

- Submit a domain for OSINT scanning
- Parallel execution using **amass** and **theHarvester**
- Scan history with detailed results
- JSON & Excel export support
- Responsive dark-mode UI
- Dockerized with `docker-compose` for easy setup

---

## 🚀 Tech Stack

### ⚙️ Backend
- **FastAPI** (Python 3)
- SQLite for storage
- Structured JSON logging
- Safe subprocess execution (no shell injection)
- `amass`, `theHarvester` tools for scanning

### 💻 Frontend
- **React (Vite)**
- Dark mode theme
- Axios for API communication
- Loading indicators for smooth UX
- Fully responsive

### 🐳 DevOps
- Docker + Docker Compose
- Nginx reverse proxy for API routing
- `.env` support for clean environment config

---

## 📦 Project Structure


ptbox-osint/
├── backend/               # FastAPI backend
│   └── app/               # Routes, models, scanner logic
├── frontend/              # React frontend
│   ├── src/               # App.jsx, components
│   ├── nginx.conf         # Handles /api proxy
│   └── Dockerfile
├── docker-compose.yml     # Orchestrates backend/frontend
└── README.md


---

## 🧪 How to Run

### 1. Clone the repo

```bash
git clone https://github.com/roeebenezra/ptbox-osint-challenge.git
cd ptbox-osint
````

### 2. Run with Docker Compose

```bash
docker compose up --build
```

### 3. Visit the App

* Frontend: [http://localhost:5173](http://localhost:5173)
* API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📤 Export Scan Results

* After viewing scan results, click **Download Excel** to export.
* Raw JSON is stored in the DB and available via `/scan/{id}/export`.

---

## ⚠️ Security Notes

* All subprocesses are run safely (no direct shell usage)
* No input is ever passed unsanitized
* Logging includes scan IDs for traceability

---

## 📖 Design Patterns Used

* **Factory Pattern** for tool execution abstraction
* **Strategy Pattern** for running different OSINT tools
* Clearly separated API/model/view layers

---

## ✅ Completed Requirements

* [x] Parallel tool execution
* [x] History persistence
* [x] Responsive UI
* [x] Export feature (Excel)
* [x] Proper logging and error handling
* [x] Two classic design patterns implemented
* [x] Docker Compose orchestration

---

## 📚 Credits

* [OWASP Amass](https://github.com/owasp-amass/amass)
* [theHarvester](https://github.com/laramies/theHarvester)

````


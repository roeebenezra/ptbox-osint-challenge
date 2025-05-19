# ✅ answers.md

## 🔍 Additional Production-Grade Tests

* Test invalid domain input (e.g. missing dot, special characters)
* Ensure subprocess timeout + error capture works
* Unit tests for result parsing (helpers.py)
* Integration tests for end-to-end scan + DB persistence

---

## ⚡ Benchmarking & Optimization

* Use `asyncio.subprocess` to ensure non-blocking execution
* Future: switch to Redis-based task queue (e.g. Celery with FastAPI background tasks)
* Amass can be replaced with a custom DNS enumeration microservice to reduce memory usage

---

## 🐌 Known Bottlenecks (OSINT Tools)

* `theHarvester -b all` can take 60+ seconds due to slow external APIs
* `amass enum -passive` performs many passive lookups and can hang on slow DNS

### 🔧 Mitigation:

* Limit data sources during dev (e.g. `-b crtsh,anubis`)
* Add subprocess timeouts with graceful error handling
* Cache tool output by domain hash (future improvement)

---

## 🐳 Docker Images

* Not pushed to public registry due to time constraints (can push if requested)
* Built using:

```bash
docker compose build
```

---

## 📬 Submission

* GitHub Repo: [https://github.com/](https://github.com/)<your-username>/<repo-name>
* Docker image: *optional*
* All endpoints tested and return expected results

---

Thank you PTBOX!

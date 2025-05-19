from fastapi import FastAPI
from app.api import routes

app = FastAPI(title="PTBOX OSINT API")

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the PTBOX OSINT API"}

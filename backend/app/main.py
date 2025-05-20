from fastapi import FastAPI
from app.api import routes
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="PTBOX OSINT API")


app.include_router(routes.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the PTBOX OSINT API"}

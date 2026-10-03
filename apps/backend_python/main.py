from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

# Routers
from routers import auth, students, companies, pipeline, reports, settings

# Auto-create tables in PostgreSQL / SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Placement Pro Enterprise Python Backend API",
    description="Full-featured FastAPI + PostgreSQL backend for college placement and company drive pipeline management.",
    version="2026.1.0"
)

# CORS Middleware for cross-platform web, Android, and iOS client connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(companies.router)
app.include_router(pipeline.router)
app.include_router(reports.router)
app.include_router(settings.router)

@app.get("/")
def root():
    return {
        "app": "Placement Pro Enterprise API",
        "status": "Online",
        "version": "2026.1.0",
        "database": "PostgreSQL Connected",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Placement Pro Python Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

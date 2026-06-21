import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import Role, User, Category, Post, Comment, ReactionType, Reaction
from app.routers import auth_router, role_router, category_router, post_router, comment_router, reaction_router, user_router
from app.seed import seed_data

# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Seed default data (roles, categories, reaction types, admin user)
seed_data()

app = FastAPI(
    title="Eshita's Tech Blog API",
    description="A personal blog API built with FastAPI and PostgreSQL",
    version="2.0.0",
)

# Allow the frontend to talk to this backend
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth_router.router)
app.include_router(role_router.router)
app.include_router(category_router.router)
app.include_router(post_router.router)
app.include_router(comment_router.router)
app.include_router(reaction_router.router)
app.include_router(user_router.router)


@app.get("/")
def home():
    return {"message": "Eshita's Tech Blog API is running!"}

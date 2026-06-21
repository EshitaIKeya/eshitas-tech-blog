import os
from app.database import SessionLocal
from app.models.role import Role
from app.models.category import Category
from app.models.reaction_type import ReactionType
from app.models.user import User
from app.utils.hashing import hash_password
from app.config import ADMIN_PASSWORD


def add_if_missing(db, model, field, values):
    for value in values:
        exists = db.query(model).filter(field == value).first()
        if not exists:
            db.add(model(**{field.key: value}))
            print(f"  Added {model.__tablename__}: {value}")


def seed_data():
    db = SessionLocal()
    try:
        print("Seeding database...")

        add_if_missing(db, Role, Role.role_name, ["user", "admin"])
        db.commit()

        add_if_missing(db, Category, Category.name, [
            "Technology", "Programming", "FastAPI", "Database", "General"
        ])

        add_if_missing(db, ReactionType, ReactionType.name, [
            "like", "love", "sad", "angry"
        ])

        # Create admin user if none exists
        admin_role = db.query(Role).filter(Role.role_name == "admin").first()
        admin_exists = db.query(User).filter(User.role_id == admin_role.id).first()

        if not admin_exists:
            admin_user = User(
                username="Eshita",
                email="admin@blog.com",
                hashed_password=hash_password(ADMIN_PASSWORD),
                role_id=admin_role.id,
            )
            db.add(admin_user)
            print("  Default admin created: username=Eshita")

        db.commit()
        print("Seed complete!")

    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")

    finally:
        db.close()

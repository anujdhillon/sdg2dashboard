from dotenv import load_dotenv
import os
import redis

load_dotenv()


class AppConfig:

    SECRET_KEY = os.environ["SECRET_KEY"]
    CORS_HEADERS = 'Content-Type'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    mysql_host: str = os.getenv('MYSQL_HOST', 'localhost')
    mysql_port: int = int(os.getenv('MYSQL_PORT', 3306))
    mysql_user: str = os.getenv('MYSQL_USER', 'root')
    mysql_password: str = os.getenv('MYSQL_PASSWORD', '')
    mysql_database: str = os.getenv('MYSQL_DATABASE', 'nutriai')
    telegram_token: str = os.getenv('TELEGRAM_BOT_TOKEN', '')
    jwt_secret: str = os.getenv('JWT_SECRET', 'change-me-please')
    jwt_algorithm: str = os.getenv('JWT_ALGORITHM', 'HS256')
    jwt_exp_minutes: int = int(os.getenv('JWT_EXP_MINUTES', 60))

settings = Settings()

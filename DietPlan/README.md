# NutriAI

NutriAI is a nutrition planning system with a Python backend, Streamlit user/admin dashboards, a Telegram bot, and MySQL-backed persistence.

## Architecture

- `streamlit_user_app/` — User-facing Streamlit dashboard
- `streamlit_admin_app/` — Admin Streamlit dashboard
- `telegram_bot/` — Telegram bot integration
- `nutriai_backend/` — Core Python business logic, authentication, recommendation engine
- `models/` — Machine learning artifacts and model files
- `data/` — Database schema and seed data
- `config/` — Environment configuration examples

## Quick start

1. Install dependencies

```bash
python -m pip install -r requirements.txt
```

2. Copy and update environment variables

```bash
copy config\.env.example .env
```

3. Create the database and tables

```bash
python -c "from nutriai_backend.db import init_db; init_db()"
```

4. Run the Streamlit user app

```bash
streamlit run streamlit_user_app/app.py
```

5. Run the Streamlit admin app

```bash
streamlit run streamlit_admin_app/app.py
```

6. Start the Telegram bot

```bash
python telegram_bot/bot.py
```

## Notes

- Use `data/schema.sql` to inspect the initial schema layout.
- Store ML artifacts in `models/` and load them from `nutriai_backend/recommender.py`.
- Power BI dashboard configuration is external and reads from MySQL.

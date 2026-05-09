# Inatallation and Setup
1. Clone this repo
2. Ensure you have `docker`, `docker-compose-plugin`, and `npm` installed
3. In a terminal, go to the backend directory with `cd backend`
4. Install python packages with `pip install -r requirements.py`
5. Start Redis with `docker compose up -d redis`
6. In another terminal, go to the frontend directory with `cd frontend`
7. Ensure you have all dependencies in `package.json` installed.
8. Set up postgres and use pgAdmin to manage your database

# Running the App
1. In your backend terminal, ensure it is in venv
2. If not, activate it with `source .venv/Scripts/activate`
3. Run the backend with `uvicorn main:app --reload --port 8000`
4. Open your backend app and go to docs to test your backend. (e.g. `localhost:8000/docs`)
5. In your frontend terminal, run the frontend with `npm run dev`

# Environment Variables Examples
## Backend
* DATABASE_URL=postgresql://{user}:{password}@{address e.g. localhost}:{port e.g. 5432}/{database}
* JWT_SECRET=your-secret-key-that-is-32-characters-or-more
* JWT_ALGORITHM=HS256
* ACCESS_TOKEN_EXPIRE_MINUTES=60
* REDIS_URL=redis//{address e.g. localhost}:{port e.g. 6379}/0

## Frontend
* VITE_APP_URL=http://127.0.0.1:8000/api

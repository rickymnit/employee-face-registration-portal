# Deployment Instructions

This project contains a full-stack face registration system.

## Local Development

### 1. Backend (FastAPI)
1. Ensure Python 3.9+ is installed.
2. From the root directory, create a virtual environment: `python3 -m venv venv`
3. Activate it: `source venv/bin/activate`
4. Install requirements: `pip install -r requirements.txt`
5. Run the server: `uvicorn backend.main:app --reload`
*The server will run on http://localhost:8000.*

### 2. Frontend (React)
1. Open a new terminal.
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
*The frontend will start and proxy requests locally.*

---

## Railway Deployment

This project is tailored to be deployed seamlessly on [Railway](https://railway.app/).

1. Push this repository to GitHub.
2. Log in to Railway and create a **New Project** from your GitHub repository.
3. Railway will likely detect two services: a Python application (due to `requirements.txt`) and a Node application (due to `frontend/package.json`).

### Backend Service (Python)
1. Add a **PostgreSQL Database** from the Railway dashboard by clicking `New -> Database -> Add PostgreSQL`.
2. Connect the Postgres database to your backend service. Railway will automatically provide the `DATABASE_URL` environment variable to the backend.
3. The buildpack will automatically install native tools and the packages in `requirements.txt`.
4. Go to **Settings -> Start Command** and ensure it runs:
   `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`

### Frontend Service (React)
1. Assuming Railway handles the frontend as a static site or a separate Node container, specify the root directory as `/frontend`.
2. Provide the build command: `npm run build`
3. In the frontend service settings, expose the environment variable connecting it to the backend's public domain:
   `VITE_API_URL=https://<your-railway-backend-domain.up.railway.app>`
4. Deploy the frontend.

## Database Note (SQLAlchemy)
The base code uses SQLAlchemy with PostgreSQL/SQLite fallbacks. If running locally without a `DATABASE_URL`, it automatically creates `local_db.sqlite`! When deployed to Railway with the Postgres plugin, it binds safely using the `DATABASE_URL`!

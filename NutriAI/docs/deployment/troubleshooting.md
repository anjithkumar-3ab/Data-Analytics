# NutriAI Troubleshooting Guide

## Common issues

### Backend fails to start

- Verify `MONGODB_URI` is valid.
- Confirm the database is reachable.
- Check container logs with `docker compose logs backend`.

### Frontend cannot reach backend

- Verify `VITE_API_BASE_URL` points to the correct backend URL.
- Confirm CORS is enabled for the frontend origin.

### Authentication errors

- Ensure `JWT_SECRET` is set and consistent.
- Confirm the token expiry value is correct.

### Database connection issues

- Check MongoDB Atlas network access and credentials.
- Ensure the IP allowlist includes your deployment environment.

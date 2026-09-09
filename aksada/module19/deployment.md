# CryptoTrace Module 19
# Docker and Deployment

## Services

CryptoTrace uses:

1. React frontend
2. FastAPI backend
3. PostgreSQL database

## Configuration

Environment variables must be supplied through environment configuration.

Do not commit real API keys or passwords.

## Development

The Docker Compose configuration provides the services required for local integration testing.

Frontend:
http://localhost:5173

Backend:
http://localhost:8000

## Production Note

The development PostgreSQL credentials must not be used in production.

Real blockchain provider credentials must be stored as environment secrets.
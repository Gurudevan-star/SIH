# CryptoTrace Module 17
# Frontend / Backend Integration

## Frontend API

The React frontend uses the API client from Module 16.

The frontend communicates with:

POST /api/cases

POST /api/investigations

GET /api/investigations/{id}

GET /api/investigations/{id}/status

GET /api/investigations/{id}/transactions

GET /api/investigations/{id}/graph

GET /api/investigations/{id}/clusters

GET /api/investigations/{id}/exchanges

GET /api/investigations/{id}/risk

GET /api/investigations/{id}/evidence

GET /api/investigations/{id}/report

POST /api/investigations/{id}/monitoring

DELETE /api/investigations/{id}/monitoring

## WebSocket

/ws/investigations/{id}

## Complete Flow

React
↓
api.js
↓
FastAPI
↓
Investigation Orchestrator
↓
Modules 1-15
↓
InvestigationResult
↓
React Dashboard

For real-time events:

FastAPI
↓
WebSocket
↓
websocket.js
↓
React Dashboard
↓
Alert
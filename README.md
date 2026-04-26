# Nowtify MVP

Nowtify is a real-time prediction mobile app around live news-style events.

## Stack
- **Frontend:** React Native (Expo Go)
- **Backend:** Java Spring Boot (REST + SSE)
- **Database:** PostgreSQL
- **Auth:** Guest-only (username + locally stored generated userId)

## Project structure

```
Nowtify/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/nowtify/
│       │   ├── controller/
│       │   ├── dto/
│       │   ├── model/
│       │   ├── repository/
│       │   └── service/
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               ├── V1__create_schema.sql
│               └── V2__seed_demo_events.sql
└── frontend/
    ├── App.js
    ├── app.json
    ├── package.json
    └── src/
        ├── components/
        ├── context/
        ├── screens/
        ├── services/
        └── theme/
```

## Backend setup (Spring Boot)

### 1) Create PostgreSQL database
```sql
CREATE DATABASE nowtify;
```

### 2) Environment variables
Create and export values before running backend:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/nowtify
export DB_USER=postgres
export DB_PASSWORD=postgres
export PORT=8080
```

### 3) Run backend
```bash
cd backend
mvn spring-boot:run
```

Flyway migrations auto-run on startup and seed 5 fictional Israel-news-style demo events.

## Frontend setup (Expo Go)

### 1) Install dependencies
```bash
cd frontend
npm install
```

### 2) Environment variable
Set API URL for device/emulator access:

```bash
export EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:8080
```

> Use your machine LAN IP, not localhost, when running on a phone with Expo Go.

### 3) Start Expo
```bash
npm run start
```

Scan QR with Expo Go.

## REST API overview

- `POST /users/guest`
- `GET /events`
- `GET /events/{id}`
- `POST /events/{id}/vote`
- `GET /leaderboard`
- `GET /users/{userId}/profile`
- `POST /admin/events`
- `POST /admin/events/{eventId}/resolve`
- `GET /events/stream` (SSE realtime updates)

## Example admin resolve payload

`POST /admin/events/{eventId}/resolve`
```json
{
  "outcome": "YES"
}
```

## Scoring rules
- Correct prediction: `+10`
- Wrong prediction: `-3`
- Unresolved predictions: no score impact

## Notes
- Users can vote once per event.
- Votes are stored server-side and reflected with live percentages.
- Profile screen includes historical user votes and outcomes.

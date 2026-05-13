# Setup

This guide covers everything you need to run `jwt-oauth-mfa-app` locally.

---

## Prerequisites

- Java 21+
- Node.js 18+
- Docker + Docker Compose
- A Google and/or GitHub OAuth app (for Social Login — see [OAuth Setup](#oauth-setup) below)

---

## Startup Order

Always start services in this order:

```
1. docker compose up -d     → PostgreSQL must be running first
2. ./mvnw spring-boot:run   → Backend connects to PostgreSQL on startup
3. npm run dev              → Frontend connects to the backend API
```

---

## Step 1 — Start PostgreSQL with Docker

From the project root(jwt-oauth-mfa-app):

```bash
docker compose up -d
```

This starts:

- **PostgreSQL 16** on port `5432` (database: `authdb`, user: `authuser`)
- **pgAdmin 4** on port `5050` — optional DB browser at `http://localhost:5050`

To stop them:

```bash
docker compose down
```

> **Note:** Always start Docker before the backend. Spring Boot will crash on startup if PostgreSQL is unreachable.

---

## Step 2 — Start the Backend

```bash
cd backend
cp src/main/resources/application.example.yml src/main/resources/application.yml
# Edit application.yml if needed (DB credentials, JWT secret, OAuth keys)
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.

On first run, Hibernate will automatically create the `users` table in PostgreSQL via JPA (`ddl-auto: update`) — no manual SQL needed.

### Backend Environment Variables

| Variable                     | Description                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| `DB_URL`                     | PostgreSQL JDBC URL (e.g. `jdbc:postgresql://localhost:5432/authdb`) |
| `DB_USERNAME`                | PostgreSQL username                                                  |
| `DB_PASSWORD`                | PostgreSQL password                                                  |
| `JWT_SECRET`                 | Secret key for signing JWTs (min 256-bit)                            |
| `JWT_EXPIRATION_MS`          | Access token TTL in milliseconds (e.g. `900000` for 15 min)          |
| `OAUTH_GOOGLE_CLIENT_ID`     | Google OAuth client ID                                               |
| `OAUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret                                           |
| `OAUTH_GITHUB_CLIENT_ID`     | GitHub OAuth client ID                                               |
| `OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth client secret                                           |

---

## Step 3 — Start the Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your API base URL if needed
npm install
npm run dev
```

The app will start on `http://localhost:5173`.

### Frontend Environment Variables

| Variable            | Description                                         |
| ------------------- | --------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:8080`) |

---

## Verifying the Setup

Once all three are running, test the backend with:

```bash
# Register a user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test"}'

# Login and get a JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

A successful login returns a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## Database Setup

Spring Boot handles schema creation automatically via JPA/Hibernate on first run (`ddl-auto: update`). No manual SQL is required beyond having the database created by Docker Compose.

If you need to create the database manually:

```sql
CREATE DATABASE authdb;
```

---

## OAuth Setup

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create an OAuth 2.0 Client ID (Web Application)
3. Add `http://localhost:8080/login/oauth2/code/google` as an authorized redirect URI
4. Copy the client ID and secret into `application.yml` (or the corresponding env vars)

### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL to `http://localhost:8080/login/oauth2/code/github`
4. Copy the client ID and secret into `application.yml` (or the corresponding env vars)

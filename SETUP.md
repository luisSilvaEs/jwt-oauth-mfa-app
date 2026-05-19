# Setup

This guide covers everything you need to run `jwt-oauth-mfa-app` locally.

---

## Prerequisites

- Node.js 18+
- Docker + Docker Compose
- A Google and/or GitHub OAuth app (for Social Login — see [OAuth Setup](#oauth-setup) below)

> **Note:** Java is no longer required locally. The backend now runs fully inside Docker.

---

## Architecture Overview

All backend services are containerized and managed by Docker Compose:

| Service      | Description                               | Port              |
| ------------ | ----------------------------------------- | ----------------- |
| **nginx**    | Load balancer / reverse proxy entry point | `80`              |
| **backend**  | Spring Boot API (one or more replicas)    | `8080` (internal) |
| **postgres** | PostgreSQL 16 database                    | `5432`            |
| **pgAdmin**  | Optional DB browser                       | `5050`            |

The frontend communicates exclusively through **nginx on port `80`** — it never talks directly to the backend containers.

---

## Startup Order

Always start services in this order:

```
1. docker compose up -d --build     → Start PostgreSQL, backend, and nginx containers
2. npm run dev                      → Frontend connects through nginx
```

---

## Step 1 — Start All Backend Services with Docker

From the project root (`jwt-oauth-mfa-app`):

```bash
docker compose up -d --build
```

This starts:

- **PostgreSQL 16** on port `5432` (database: `authdb`, user: `authuser`)
- **Spring Boot backend** — one or more replicas, internal port `8080`
- **nginx** on port `80` — load balances requests across backend replicas
- **pgAdmin 4** on port `5050` — optional DB browser at `http://localhost:5050`

To scale the number of backend replicas:

```bash
docker compose up -d --build --scale backend=3
```

To stop all services:

```bash
docker compose down
```

> **Note:** nginx depends on the backend, and the backend depends on PostgreSQL. Docker Compose handles this order automatically via `depends_on`. Do not start them individually.

---

## Step 2 — Configure Backend Environment Variables

Before building the containers, copy the example env file and edit it:

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your DB credentials, JWT secret, and OAuth keys
```

Docker Compose will pick up the variables from `backend/.env` automatically.

### Backend Environment Variables

| Variable                     | Description                                                         |
| ---------------------------- | ------------------------------------------------------------------- |
| `DB_URL`                     | PostgreSQL JDBC URL (e.g. `jdbc:postgresql://postgres:5432/authdb`) |
| `DB_USERNAME`                | PostgreSQL username                                                 |
| `DB_PASSWORD`                | PostgreSQL password                                                 |
| `JWT_SECRET`                 | Secret key for signing JWTs (min 256-bit)                           |
| `JWT_EXPIRATION_MS`          | Access token TTL in milliseconds (e.g. `900000` for 15 min)         |
| `OAUTH_GOOGLE_CLIENT_ID`     | Google OAuth client ID                                              |
| `OAUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret                                          |
| `OAUTH_GITHUB_CLIENT_ID`     | GitHub OAuth client ID                                              |
| `OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth client secret                                          |

> **Note:** `DB_URL` uses the Docker service name `postgres` (not `localhost`) because the backend and database run on the same Docker network.

---

## Step 3 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will start on `http://localhost:5173`. Open your browser and navigate to:

```
http://localhost:5173/login
```

### Frontend Environment Variables

| Variable            | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `VITE_API_BASE_URL` | nginx entry point URL — use `http://localhost` (port 80, not 8080) |

---

## Verifying the Setup

Once all services are running, verify the stack via nginx:

```bash
# Register a user (through nginx)
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","name":"Test"}'

# Login and get a JWT token (through nginx)
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

A successful login returns a JWT token:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

To confirm nginx is distributing load across replicas, check the container logs.

Follow all replicas at once:

```bash
docker compose logs -f backend
```

Follow specific replicas by their container name (useful when scaled to multiple instances):

```bash
docker compose logs -f backend-1 backend-2 backend-3
```

> Container names follow the pattern `<project>-backend-<n>` by default. Run `docker compose ps` to see the exact names for your setup.

---

## nginx Configuration

nginx acts as the reverse proxy and load balancer for all backend replicas. By default it uses a round-robin strategy. The relevant config (`nginx/nginx.conf`) looks like:

```nginx
upstream backend_cluster {
    server backend:8080;   # Docker Compose resolves this across all replicas
}

server {
    listen 80;

    location /api/ {
        proxy_pass         http://backend_cluster;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

> Adjust `nginx/nginx.conf` to change load balancing strategy (e.g. `least_conn`, `ip_hash`) or to add SSL termination.

---

## Database Setup

Spring Boot handles schema creation automatically via JPA/Hibernate on first run (`ddl-auto: update`). No manual SQL is required — Docker Compose creates the database on container startup.

If you need to create the database manually:

```sql
CREATE DATABASE authdb;
```

---

## OAuth Setup

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create an OAuth 2.0 Client ID (Web Application)
3. Add `http://localhost/login/oauth2/code/google` as an authorized redirect URI
4. Copy the client ID and secret into `backend/.env`

### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL to `http://localhost/login/oauth2/code/github`
4. Copy the client ID and secret into `backend/.env`

> **Important:** OAuth redirect URIs now point to `http://localhost` (port 80, through nginx) instead of `http://localhost:8080` directly. Update any existing OAuth apps accordingly.

# jwt-oauth-mfa-app

A full-stack authentication learning project demonstrating **JWT**, **OAuth 2.0 / Social Login**, and **Multi-Factor Authentication (TOTP)** using a modern React + Spring Boot stack.

---

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Frontend | React 18 + TypeScript, Vite                            |
| Backend  | Java 21, Spring Boot 3, Spring Security                |
| Auth     | JWT (jjwt), OAuth 2.0 (Google/GitHub), TOTP (java-otp) |
| Database | PostgreSQL                                             |
| MFA      | Microsoft Authenticator (TOTP / RFC 6238)              |

---

## Project Structure

```
jwt-oauth-mfa-app/
├── backend/        # Java + Spring Boot REST API
├── frontend/       # React + TypeScript SPA
└── README.md
```

---

## Features

- **Username & Password Login** — traditional credentials with BCrypt hashing
- **Social OAuth Login** — Login with Google and/or GitHub
- **JWT Authentication** — stateless token-based auth with access and refresh tokens
- **MFA / TOTP** — QR code enrollment and 6-digit code verification via Microsoft Authenticator (or any TOTP app)
- **Protected Routes** — frontend and backend route/endpoint protection
- **Auth Dashboard** — visualizes JWT claims, session info, OAuth scopes, and MFA status

---

## Pages

| Page          | Description                                |
| ------------- | ------------------------------------------ |
| `/login`      | Email/password + Social OAuth buttons      |
| `/register`   | Sign up with email/password or OAuth       |
| `/mfa/setup`  | QR code enrollment for TOTP                |
| `/mfa/verify` | 6-digit code verification on login         |
| `/home`       | Protected dashboard with auth info widgets |
| `/profile`    | User info, auth method, MFA management     |

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- Docker + Docker Compose
- A Google and/or GitHub OAuth app (for Social Login)

---

### Starting the Project

#### Step 1 — Start PostgreSQL with Docker

From the project root, start the database:

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

#### Step 2 — Start the Backend

```bash
cd backend
cp src/main/resources/application.example.yml src/main/resources/application.yml
# Edit application.yml if needed (DB credentials, JWT secret, OAuth keys)
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.

On first run, Hibernate will automatically create the `users` table in PostgreSQL via JPA (`ddl-auto: update`) — no manual SQL needed.

---

#### Step 3 — Start the Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env with your API base URL if needed
npm install
npm run dev
```

The app will start on `http://localhost:5173`.

---

### Startup Order

Always follow this order:

```
1. docker compose up -d     → PostgreSQL must be running first
2. ./mvnw spring-boot:run   → Backend connects to PostgreSQL on startup
3. npm run dev              → Frontend connects to the backend API
```

---

### Verifying the Setup

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

### Frontend Environment Variables

| Variable            | Description                                         |
| ------------------- | --------------------------------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:8080`) |

---

### Database Setup

```sql
CREATE DATABASE authdb;
```

Spring Boot will handle schema creation via JPA/Hibernate on first run (set `spring.jpa.hibernate.ddl-auto=update` in dev).

---

## Auth Flow Overview

```
1. Register (email/password or OAuth)
        ↓
2. MFA Setup — scan QR code with Microsoft Authenticator
        ↓
3. Login — submit credentials
        ↓
4. MFA Verify — submit 6-digit TOTP code
        ↓
5. JWT issued — stored in httpOnly cookie or Authorization header
        ↓
6. Access protected routes with Bearer token
```

---

## OAuth Setup (Local Dev)

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create an OAuth 2.0 Client ID (Web Application)
3. Add `http://localhost:8080/login/oauth2/code/google` as an authorized redirect URI

### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL to `http://localhost:8080/login/oauth2/code/github`

---

## MFA Notes

This app uses **TOTP (RFC 6238)** — the same open standard used by Google Authenticator, Authy, and Microsoft Authenticator. There is no dependency on Microsoft's servers; the authenticator app simply generates time-based codes locally on the device.

---

## License

MIT

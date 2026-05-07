# jwt-oauth-mfa-app

A full-stack authentication learning project demonstrating **JWT**, **OAuth 2.0 / Social Login**, and **Multi-Factor Authentication (TOTP)** using a modern React + Spring Boot stack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite |
| Backend | Java 21, Spring Boot 3, Spring Security |
| Auth | JWT (jjwt), OAuth 2.0 (Google/GitHub), TOTP (java-otp) |
| Database | PostgreSQL |
| MFA | Microsoft Authenticator (TOTP / RFC 6238) |

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

| Page | Description |
|---|---|
| `/login` | Email/password + Social OAuth buttons |
| `/register` | Sign up with email/password or OAuth |
| `/mfa/setup` | QR code enrollment for TOTP |
| `/mfa/verify` | 6-digit code verification on login |
| `/home` | Protected dashboard with auth info widgets |
| `/profile` | User info, auth method, MFA management |

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL 15+
- A Google and/or GitHub OAuth app (for Social Login)

---

### Backend Setup

```bash
cd backend
cp src/main/resources/application.example.yml src/main/resources/application.yml
# Edit application.yml with your DB and OAuth credentials
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`.

#### Backend Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL JDBC URL (e.g. `jdbc:postgresql://localhost:5432/authdb`) |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Secret key for signing JWTs (min 256-bit) |
| `JWT_EXPIRATION_MS` | Access token TTL in milliseconds (e.g. `900000` for 15 min) |
| `OAUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `OAUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |

---

### Frontend Setup

```bash
cd frontend
cp .env.example .env
# Edit .env with your API base URL
npm install
npm run dev
```

The app will start on `http://localhost:5173`.

#### Frontend Environment Variables

| Variable | Description |
|---|---|
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

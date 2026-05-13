# Architecture

This document describes the technical architecture of `jwt-oauth-mfa-app` — a full-stack authentication learning project built with React + Spring Boot.

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
backend/
├── src/
│   ├── main/
│   │   ├── java/com/luissilvacoding/jwt_oauth_mfa_app/
│   │   │   ├── JwtOauthMfaAppApplication.java
│   │   │   ├── config/           # SecurityConfig, CorsConfig, etc.
│   │   │   ├── controller/       # AuthController, UserController, MfaController
│   │   │   ├── dto/              # Request/Response DTOs
│   │   │   ├── entity/           # User, RefreshToken JPA entities
│   │   │   ├── repository/       # UserRepository, TokenRepository
│   │   │   ├── security/         # JwtFilter, JwtUtil, OAuth2 handlers
│   │   │   └── service/          # AuthService, MfaService, UserService
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application.example.yml
│   └── test/
├── pom.xml
└── .mvn/

frontend/
├── src/
│   ├── api/              # Axios instances, API call functions
│   ├── components/       # Reusable UI components
│   ├── context/          # AuthContext (JWT state, user info)
│   ├── hooks/            # useAuth, useMfa custom hooks
│   ├── pages/            # Login, Register, MfaSetup, MfaVerify, Home, Profile
│   ├── routes/           # ProtectedRoute, AppRouter
│   ├── types/            # TypeScript interfaces/types
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── .env.example
└── README.md
```

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

## Auth Flow

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

## OAuth 2.0 — Social Login

The app delegates authentication to Google and/or GitHub using the OAuth 2.0 Authorization Code flow. Spring Security handles the redirect, token exchange, and user info retrieval automatically via its built-in OAuth 2.0 client support.

### Supported Providers

| Provider | Callback URL                                     |
| -------- | ------------------------------------------------ |
| Google   | `http://localhost:8080/login/oauth2/code/google` |
| GitHub   | `http://localhost:8080/login/oauth2/code/github` |

For local dev setup instructions (registering OAuth apps), see [SETUP.md](./SETUP.md).

---

## MFA — TOTP (RFC 6238)

The app implements **Time-based One-Time Passwords** per RFC 6238 — the same open standard used by Google Authenticator, Authy, and Microsoft Authenticator.

- A TOTP secret is generated server-side during MFA enrollment
- A QR code is shown to the user to scan with their authenticator app
- On every login, the user submits a 6-digit code that is validated against the secret
- **No dependency on Microsoft's servers** — the authenticator app generates codes locally on the device

---

## JWT — Token Strategy

- **Access token** — short-lived (default: 15 min), sent as a `Bearer` token in the `Authorization` header or stored in an `httpOnly` cookie
- **Refresh token** — longer-lived, used to obtain a new access token without re-authentication
- Tokens are signed with a shared secret (`JWT_SECRET`) using HMAC-SHA256
- JWT claims include: `sub` (user ID/email), `exp` (expiry), roles, and auth method

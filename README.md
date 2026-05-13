# jwt-oauth-mfa-app

A full-stack authentication learning project demonstrating **JWT**, **OAuth 2.0 / Social Login**, and **Multi-Factor Authentication (TOTP)** using a modern React + Spring Boot stack.

---

## Features

- **Username & Password Login** — traditional credentials with BCrypt hashing
- **Social OAuth Login** — Login with Google and/or GitHub
- **JWT Authentication** — stateless token-based auth with access and refresh tokens
- **MFA / TOTP** — QR code enrollment and 6-digit code verification via Microsoft Authenticator (or any TOTP app)
- **Protected Routes** — frontend and backend route/endpoint protection
- **Auth Dashboard** — visualizes JWT claims, session info, OAuth scopes, and MFA status

---

## Documentation

| Document                             | Description                                                 |
| ------------------------------------ | ----------------------------------------------------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, project structure, auth flow, JWT & MFA design  |
| [SETUP.md](./SETUP.md)               | Local environment setup, Docker, env vars, and OAuth config |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines and development workflow            |

---

## License

MIT

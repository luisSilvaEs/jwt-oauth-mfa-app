# ROADMAP

## Phase 1 — User Entity

1. Learned about _JPA_, _Hibernate_, **annotations**, and the difference between class and interface
2. Created `User.java` with **@Entity** — _Hibernate_ auto-created the users table in _PostgreSQL_
3. Created `UserRepository.java` extending _JpaRepository_ for free DB operations
4. Verified the users table appeared in _pgAdmin_ ✅
5. Committed and merged _feature/user-entity_ into main

## Phase 2 — JWT authentication

> Goal: Implement register and login endpoints with JWT token generation and protected route support.

The steps are:

1. Create AuthController — with two endpoints:

```
POST /api/auth/register — accepts email/password, saves the user
POST /api/auth/login — validates credentials, returns a JWT token
```

2. Add a `JWT Utility class` — handles generating and validating tokens (uses a secret key + expiration time)
3. Add a `JWT Filter` — intercepts every incoming request, reads the Authorization header, and validates the token before letting the request through
4. Configure Spring Security — sets up which routes are public (register/login) and which require a valid token
5. Test with Postman — verify the full flow: register → login → get token → access a protected endpoint

## Phase 3 — OAuth with Google and GitHub

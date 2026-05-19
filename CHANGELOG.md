## 6.0.0 - 2026-05-19

**Dockerize backend to use nginx**

- feat: configure nignx and dockerize backend, use round robin to balance load in 3 dockerized backend services
- feat: update Oauth uris
- fix: resolve MFA verify-setup 400 Invalid Code error
- feat: add alert to improve feedback when user not found
- docs: update documentation to set up the app
- all flows tested

---

## 5.0.0 - 2026-05-19

**Home page completed, Profile page and endpoint implementation **

- Implement new endpoint (/me) used for profile page
- Implement profile page
- fix: add missing parameters to generateToken function due to new columns added to the DB table
- Implement OAuth handlers success and failure
- Implement dashboard filters
- Fix DTO update fields modifiers (private) adding getters and setters
- Implement SessionInfo

---

## 4.0.0 - 2026-05-15

**Front end integration with MFA Endpoints**

- Types & AuthContext
- Routing & Protected Routes
- Auth Pages
- MFA Setup Page

---

## 3.0.0 - 2026-05-14

**Backend for OAuth and MFA completed**

- Completed Login Path A Local Authentication (email + password + MFA)
- Completed Login Path B  Social Authentication (Google / GitHub)

---

## 2.0.0 - 2026-05-13

**Development**

- Create User entity
- Implement JWT authentication
- Document endpoints using Swagger
- Update project documentation

---

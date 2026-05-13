# Contributing

Thank you for contributing to `jwt-oauth-mfa-app`! Please follow the conventions below to keep the repository history clean and consistent.

---

## Branch Naming

Branches must communicate their purpose at a glance using a prefix and a short descriptor separated by a slash.

```
<prefix>/<short-descriptor>
```

### Prefixes

| Prefix      | Purpose                           | Example                       |
| ----------- | --------------------------------- | ----------------------------- |
| `feature/`  | New feature development           | `feature/user-authentication` |
| `fix/`      | Bug fix                           | `fix/login-crash-ios`         |
| `hotfix/`   | Urgent fix directly to production | `hotfix/payment-gateway-down` |
| `release/`  | Preparing a release               | `release/2.1.0`               |
| `chore/`    | Maintenance, configs, deps        | `chore/update-dependencies`   |
| `docs/`     | Documentation updates             | `docs/api-reference`          |
| `test/`     | Adding or fixing tests            | `test/checkout-flow`          |
| `refactor/` | Code restructuring                | `refactor/auth-module`        |

### With a Ticket ID (Jira / GitHub Issues)

When work is tracked in an issue, include the ticket ID after the prefix:

```
feature/AUTH-123-user-authentication
fix/BUG-456-login-crash
```

### Permanent Branches

| Branch            | Purpose                         |
| ----------------- | ------------------------------- |
| `main` / `master` | Production-ready code           |
| `development`     | Integration branch for features |
| `staging`         | Pre-production testing          |

### General Rules

- **Lowercase only** — `feature/dark-mode` ✓ · `Feature/DarkMode` ✗
- **Hyphens as separators** — `user-authentication` ✓ · `user_authentication` ✗
- **Short but descriptive** — avoid vague names like `fix` or `update`
- **No special characters** — only letters, numbers, hyphens, and slashes

---

## Commit Messages

This project follows the [Conventional Commits](https://www.conventionalcommits.org) specification. Structured commit messages enable automated versioning and readable history.

```
<prefix>: <short description>
```

### Prefixes

| Prefix     | Purpose                          | Example                              |
| ---------- | -------------------------------- | ------------------------------------ |
| `feat`     | New feature                      | `feat: add dark mode toggle`         |
| `fix`      | Bug fix                          | `fix: resolve login crash on iOS`    |
| `docs`     | Documentation changes only       | `docs: update README setup steps`    |
| `style`    | Formatting, no logic change      | `style: reformat auth module`        |
| `refactor` | Restructure without new features | `refactor: simplify payment logic`   |
| `test`     | Adding or updating tests         | `test: add unit tests for cart`      |
| `chore`    | Maintenance, config, deps        | `chore: bump lodash to 4.17.21`      |
| `perf`     | Performance improvements         | `perf: lazy-load dashboard widgets`  |
| `ci`       | CI/CD pipeline changes           | `ci: add GitHub Actions workflow`    |
| `build`    | Build system or deps changes     | `build: switch from webpack to vite` |
| `revert`   | Reverts a previous commit        | `revert: feat: add dark mode toggle` |

### Breaking Changes

Append `!` after the prefix to signal a breaking change. This triggers a major semver bump:

```
feat!: redesign auth API
```

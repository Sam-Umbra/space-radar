# 🤝 Contributing to Space Radar

Thank you for your interest in contributing! This document outlines the process to help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Development Setup](#development-setup)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## How to Contribute

1. **Fork** the repository
2. **Clone** your fork locally
3. Create a new **branch** from `develop` (never from `main`)
4. Make your changes
5. **Test** your changes thoroughly
6. Open a **Pull Request** targeting `develop`

---

## Branch Strategy

| Branch      | Purpose                                      |
|-------------|----------------------------------------------|
| `main`      | Stable production code — protected, no direct push |
| `develop`   | Active development — base for all PRs        |
| `feature/*` | New features (e.g. `feature/websocket-auth`) |
| `fix/*`     | Bug fixes (e.g. `fix/nasa-timeout`)          |
| `hotfix/*`  | Critical production fixes                    |

---

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(scope): short description

[optional body]
```

### Types

| Type       | When to use                              |
|------------|------------------------------------------|
| `feat`     | New feature                              |
| `fix`      | Bug fix                                  |
| `docs`     | Documentation changes only               |
| `refactor` | Code change that is neither fix nor feat |
| `test`     | Adding or updating tests                 |
| `chore`    | Build process, dependency updates, etc.  |
| `perf`     | Performance improvements                 |

### Examples

```
feat(nasa): add historical data fetch for model training
fix(websocket): handle reconnection on client disconnect
docs(readme): update setup instructions for Python service
chore(deps): bump Spring Boot to 4.0.5
```

---

## Pull Request Process

1. Ensure your branch is up to date with `develop` before opening a PR
2. Fill in the **Pull Request template** completely
3. Link any related Issues using `Closes #<issue-number>`
4. Request a review from at least **one maintainer**
5. All checks must pass before merging
6. PRs are merged using **Squash and Merge** to keep history clean

---

## Development Setup

### Java API (`space-radar`)

```bash
# Prerequisites: Java 25, Maven 3.9+
git clone https://github.com/sam-umbra/space-radar.git
cd space-radar/space-radar-api
mvn clean install
mvn spring-boot:run
```

Configure `resources/META-INF/env.properties` with your NASA API key and ML endpoint before running.

### Python ML (`py-space-radar`)

```bash
# Prerequisites: Python 3.10+
git clone https://github.com/sam-umbra/space-radar.git
cd space-radar/py-space-radar
pip install -r requirements.txt
# conda env update --file environment.yml --prune (If you're using anaconda)
uvicorn src.main:app --reload
```

---

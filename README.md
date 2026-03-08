# LegalAI - AI-Powered Lawyer Discovery Platform

![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black)
![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.3-6DB33F)
![Java](https://img.shields.io/badge/Java-23-orange)
![Database](https://img.shields.io/badge/DB-H2_(dev)_%7C_PostgreSQL_(prod)-blue)

LegalAI helps people find the right lawyer faster.

It combines a searchable lawyer marketplace with a lightweight legal-intake assistant that classifies legal issues, suggests a practice area, and surfaces matching lawyers.

## Why this project exists

Finding legal help is often slow and confusing. Users usually do not know:
- what kind of lawyer they need,
- which city to search in,
- or how to compare options quickly.

LegalAI solves this with:
- guided intake via AI-style chat,
- practical filters (city, practice area, experience),
- and a clean flow from discovery to booking.

## Core features

- AI intake widget to describe legal problems in plain language
- Practice-area detection (Family, Property, Criminal, Corporate, IP, Tax, Immigration)
- Smart lawyer suggestions ranked by rating or lowest fee intent
- Search page with live filters and empty-state handling
- Lawyer profile pages and booking flow
- Registration API integration
- Swagger/OpenAPI docs enabled on backend
- Seeded Indian lawyer dataset for local demo

## Tech stack

### Frontend (`law-aggregator-fe`)
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS

### Backend (`law-aggregator-be`)
- Spring Boot 3.3
- Spring Web, Spring Data JPA, Spring Security
- H2 (default dev) and PostgreSQL (prod profile)
- Flyway dependency present

## Architecture

```mermaid
flowchart LR
    U[User] --> FE[Next.js Frontend :3000]
    FE --> API[Spring Boot API :8080]
    API --> DB[(H2 in-memory / PostgreSQL)]
    FE --> AI[/api/ai route]
    AI --> API
```

## Project structure

```text
.
|- law-aggregator-fe/   # Next.js web app
|- law-aggregator-be/   # Spring Boot REST API
|- README.md            # You are here
```

## Quick start (local)

### 1) Clone

```bash
git clone https://github.com/madhukar-gautam/LegalAI.git
cd LegalAI
```

### 2) Run backend

```bash
cd law-aggregator-be
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`.

Useful links:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console: `http://localhost:8080/h2-console`

### 3) Run frontend

In a new terminal:

```bash
cd law-aggregator-fe
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Environment variables

### Frontend

Create `law-aggregator-fe/.env.local`:

```env
BACKEND_URL=http://localhost:8080
```

### Backend (production profile)

`application-prod.yml` expects:

```env
DATABASE_URL=jdbc:postgresql://<host>:5432/<db>
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
```

## API overview

Base URL: `http://localhost:8080`

- `GET /v1/lawyers` - search lawyers (`city`, `practice`, `expGte`)
- `GET /v1/lawyers/{id}` - lawyer details
- `GET /v1/lawyers/practice-areas` - distinct practice areas
- `GET /v1/lawyers/cities` - distinct cities
- `POST /v1/chatbot/message` - intake assistant response + suggestions
- `POST /v1/auth/register` - register user
- `POST /v1/intake/triage` - classify legal issue
- `POST /v1/payments/checkout` - checkout stub
- `POST /v1/payments/webhook` - webhook stub

## Demo flow

1. Open home page and choose city/practice/experience filters.
2. Use AI intake widget to describe the legal issue.
3. Review suggested lawyers and open profile pages.
4. Continue to booking/checkout flow.

## Current limitations

- Payment integration is currently stubbed (placeholder endpoints).
- AI intake is keyword/rule based (not LLM-backed yet).
- No authentication/session flow for protected user journeys yet.

## Roadmap

- Real payment provider integration (Razorpay/Stripe)
- LLM-backed legal intent extraction with safer prompts
- Availability calendars and slot-based booking
- Reviews, favorites, and lawyer response SLAs
- Admin dashboard for lawyer onboarding and moderation

## Contributing

Contributions are welcome.

- Fork the repo
- Create a feature branch
- Commit clear, focused changes
- Open a PR with screenshots/API samples

## License

No license file is currently added. If you want public reuse, add a `LICENSE` file (e.g., MIT).

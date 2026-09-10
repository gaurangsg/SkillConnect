# SkillConnect API

## Run locally

```bash
npm install
npm run dev
```

The API listens on `http://localhost:5000` by default. Copy `.env.example` to `.env` to change the port or frontend origin.

## Endpoints

- `GET /api/health`
- `GET /api/services`
- `GET /api/workers?search=electrician`
- `GET /api/workers/:id`
- `GET /api/reviews`
- `POST /api/newsletter/subscriptions`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)
- `POST /api/bookings` (Bearer token required)
- `GET /api/bookings` (Bearer token required)
- `PATCH /api/bookings/:id/status` (Bearer token required)
- `DELETE /api/bookings/:id` (admin token required)
- `PATCH /api/admin/workers/:workerId/assign` (admin token required)

Without `MONGODB_URI`, the API uses in-memory demo data so the frontend can run immediately.

With MongoDB configured:

```bash
copy .env.example .env
npm run seed
npm run dev
```

The seed command upserts the current services, workers, and reviews into MongoDB. Once connected, API reads and newsletter subscriptions use MongoDB automatically.

Authentication also requires a long random `JWT_SECRET` in `.env`. The server now fails fast if either `MONGODB_URI` or `JWT_SECRET` is missing.

Worker accounts can register with `role: "worker"`. An admin must assign that account to a seeded worker profile before it can see or update bookings.

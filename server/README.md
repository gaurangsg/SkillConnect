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
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me` (Bearer token required)
- `POST /api/bookings` (Bearer token required)
- `GET /api/bookings` (Bearer token required)
- `PATCH /api/bookings/:id/status` (Bearer token required)
- `DELETE /api/bookings/:id` (admin token required)
- `GET /api/admin/overview` (admin token required)
- `GET /api/admin/bookings?page=1&limit=10&status=&search=` (admin token required)
- `GET /api/admin/users?page=1&limit=10&role=&search=` (admin token required)
- `GET /api/admin/workers` (admin token required)
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

## Administrator access

There is no public admin signup. Register the account normally, then promote it from the server directory:

```bash
npm run promote-admin -- admin@example.com
```

Sign out and back in afterward. The administrator console is available from the account menu at `/admin`; its analytics, account listings, worker assignment, and order-management APIs require the `admin` role.

Password reset links are development-only until an email provider is configured. In non-production mode, `POST /api/auth/forgot-password` returns a one-time reset token for an existing account; it expires after 15 minutes and is stored hashed. Production requests return `503` until email delivery is configured.

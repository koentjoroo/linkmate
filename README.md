### LinkMate

## Prerequisites

1. Node v18
2. NPM v9
3. MySQL Server

## Local Development Setup

1. Clone this repository to your local repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill the keys
4. Fill `NEXT_AUTH_SECRET` and `JWT_SECRET` with the same value as `GOOGLE_CLIENT_SECRET`
5. Fill `NEXT_AUTH_URL` with `http://localhost:3000` unless you specify other host when serving the app
6. Fill `NEXT_PUBLIC_API_BASE_URL` with `http://localhost:3000/api` unless you specify other host when serving the app
7. Fill `NEXT_PUBLIC_SHORTLINK_BASE_URL` with `http://localhost:3000/api/redirect` for local development
8. Fill `DATABASE_URL` with the your mysql database endpoint
9. Run `npx prisma generate`
10. Run `npx prisma db push`
11. Run `npm run dev` to serve the app in `http://localhost:3000`

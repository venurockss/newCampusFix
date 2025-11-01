# CampusFix Backend

This backend provides a minimal API for the CampusFix React Native app using:
- Express.js
- Prisma ORM
- PostgreSQL (Neon or other provider)
- JWT authentication
- bcrypt for password hashing
- dotenv for configuration

Quick setup
1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `JWT_SECRET`.
2. Install dependencies:

   npm install

3. Initialize Prisma client and run migrations (example using Prisma Migrate):

   npx prisma generate
   npx prisma migrate dev --name init

   If you are using Neon or a hosted Postgres, provide the correct `DATABASE_URL` in `.env`.

4. Start server:

   npm run dev

API endpoints
- POST /api/auth/register — { email, password, name }
- POST /api/auth/login — { email, password }
- GET /api/users/me — (protected)
- POST /api/issues — create issue (protected)
- GET /api/issues — list issues (protected)
- GET /api/issues/:id — get single issue (protected)
- PUT /api/issues/:id — update issue (protected)
- DELETE /api/issues/:id — delete issue (protected)

Notes
- This scaffold uses bcrypt and JWT. For production, use a strong `JWT_SECRET` and set TLS/SSL if needed.
- Adjust Prisma models in `prisma/schema.prisma` to your needs.

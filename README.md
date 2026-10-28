# HotelPro — MERN Hotel Booking & Management

A ready-to-run MERN starter project for a hotel booking and management system.

## Features
- Browse/search hotels and view room details
- Register and log in with JWT authentication
- Create and view bookings
- Cancel a booking (when it has not started)
- Admin dashboard endpoints to create, update, and delete hotels
- MongoDB models for users, hotels, and bookings
- Seed script with demo hotel data
- Responsive React UI

> This is a student-project starter. Before real-world deployment, add payment gateway integration, email verification, rate limiting, stronger validation, logging, tests, and production deployment configuration.

## Requirements
- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Set up the backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and update values:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```
Seed sample hotels:
```bash
npm run seed
```
Start backend:
```bash
npm run dev
```
API runs at `http://localhost:5000`.

## 2. Set up the frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the local Vite URL shown in the terminal (usually `http://localhost:5173`).

## Demo flow
1. Register a user from the top-right button.
2. Browse hotels and make a booking.
3. To use admin routes, set a user's `role` to `admin` in MongoDB (collection `users`) after registering. Admin routes are protected.

## API routes
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (authenticated)

### Hotels
- `GET /api/hotels`
- `GET /api/hotels/:id`
- `POST /api/hotels` (admin)
- `PUT /api/hotels/:id` (admin)
- `DELETE /api/hotels/:id` (admin)

### Bookings
- `POST /api/bookings` (authenticated)
- `GET /api/bookings/my` (authenticated)
- `PATCH /api/bookings/:id/cancel` (authenticated)

## Notes
- Booking dates are validated and total price is calculated on the server.
- This starter does not integrate a payment provider. Booking status starts as `confirmed` after the booking request succeeds.

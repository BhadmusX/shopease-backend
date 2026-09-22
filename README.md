# ShopEase Backend

The Express API for the ShopEase shopping cart application.

## Features

- User registration, login, logout, and token refresh
- JWT authentication with HTTP-only cookies
- User and admin authorization
- Product CRUD operations
- Product image uploads with Multer
- Cart and wishlist APIs
- Stripe checkout sessions
- Analytics summary data
- Seven-day daily sales and revenue data

## Technologies

- Node.js and Express
- MongoDB with Mongoose
- Redis for refresh-token storage
- Multer for image uploads
- Stripe for payments

## Requirements

- Node.js
- MongoDB database
- Redis instance
- Stripe test account

## Environment variables

Create a `.env` file in this folder:

```env
PORT=5000
MONGODB_URL=your-mongodb-connection-string
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REDIS_URL=your-redis-url
STRIPE_SECRET_KEY=your-stripe-secret-key
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

Do not commit real secrets to the repository.

## Running the backend

```bash
cd ShopEase-Backend
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

## API areas

- `/signup`, `/signin`, `/signout`, `/getme`
- `/refresh`
- `/product/get`, `/product/create`, `/product/update/:id`, `/product/delete/:id`
- `/cart/get`, `/cart/create`, `/cart/update/:id`, `/cart/delete/:id`
- `/favorite/get`, `/favorite/create`, `/favorite/delete/:id`
- `/payment/checkoutsession`
- `/analytics/get`
- `/analytics/get/dailysales`

Most routes require authentication. Product management and analytics routes require an admin account.

## Notes

- Uploaded images are stored in `uploads/` and served through `/uploads`.
- New users receive the `user` role by default.
- The frontend should use `VITE_API_URL=http://localhost:5000` to connect to this API.

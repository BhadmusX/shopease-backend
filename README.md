# ShopEase Backend

The Express API for the ShopEase shopping cart application.

## Features

- User registration, login, logout, and token refresh
- JWT authentication with HTTP-only cookies
- User and admin authorization
- Product CRUD operations
- Product image uploads to Cloudinary with Multer
- Cart and wishlist APIs
- Stripe checkout sessions
- Analytics summary data
- Seven-day daily sales and revenue data

## Technologies

- Node.js and Express
- MongoDB with Mongoose
- Redis for refresh-token storage
- Multer for image uploads
- Cloudinary for product image storage and delivery
- Stripe for payments

## Requirements

- Node.js
- MongoDB database
- Redis instance
- Cloudinary account
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
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET_KEY=your-cloudinary-api-secret
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

- Product create and update requests accept an image in the multipart `imageUrl` field. Images must be JPEG, PNG, or WebP and no larger than 5 MB.
- New product images are uploaded to the Cloudinary `products` folder. MongoDB stores the Cloudinary secure URL in `imageUrl` and the asset ID in `cloudinaryPublicId`.
- Replacing or deleting a product image also deletes its previous Cloudinary asset.
- Existing products with local `/uploads` image paths are not automatically migrated to Cloudinary. Migrate those image files and database records separately; the backend still serves legacy files from `/uploads`.
- New users receive the `user` role by default.
- The frontend should use `VITE_API_URL=http://localhost:5000` to connect to this API.

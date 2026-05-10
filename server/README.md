# Kalastra Server - Artisan Marketplace Backend

Welcome to the backend repository of the **Kalastra** application! This is a robust, scalable Express/Node.js REST API designed to power the Kalastra artisan marketplace. It handles everything from user authentication and database management to complex third-party AI and payment integrations.

## Key Features

*   **Secure Authentication & Authorization:** Implements robust JWT-based authentication with bcrypt password hashing. Includes Role-Based Access Control (RBAC) to differentiate between standard `users` and `sellers`.
*   **Full E-Commerce API:** Complete RESTful endpoints for managing Users, Products, Carts, Orders, and Reviews.
*   **AI Integration (Google Gemini):** Dedicated services to process text and speech, enriching product descriptions automatically and extracting intelligent search parameters.
*   **Speech-to-Text Integration:** Enables sellers to upload audio files which are transcribed and fed into the AI pipeline for seamless product listing creation.
*   **Cloud Storage Integration:** Utilizes Cloudinary (or Firebase) to securely store, serve, and delete product images and user avatars.
*   **Dual Payment Gateway Support:** Fully integrated with both **Stripe** and **Razorpay**, including secure webhook endpoints to automatically verify transactions and update order statuses.
*   **Inventory Management:** Automatically deducts stock upon successful payment and restores stock if an order is cancelled.

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Authentication:** jsonwebtoken (JWT), bcryptjs
*   **File Uploads:** Multer
*   **Third-Party Services:** Stripe API, Razorpay API, Google Generative AI (Gemini), DeepGram (Speech-to-Text), Cloudinary

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   MongoDB Instance (Local or Atlas)
*   API Keys for Stripe/Razorpay, Google Gemini, and your chosen Cloud Storage.

### Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` root directory and populate it with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   
   # AI & Storage
   GEMINI_API_KEY=<your-gemini-api-key>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   
   # Payments
   STRIPE_SECRET_KEY=<your-stripe-secret>
   STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
   RAZORPAY_KEY_ID=<your-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   RAZORPAY_WEBHOOK_SECRET=<your-razorpay-webhook-secret>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

The project strictly follows the MVC (Model-View-Controller) architecture pattern for separation of concerns:

```
server/
├── config/           # Initialization for third-party services (Cloudinary, DB)
├── controllers/      # Route logic and response formatting
├── middlewares/      # Express middlewares (Auth validation, Multer file processing)
├── models/           # Mongoose schemas (User, Product, Order, Review)
├── routes/           # Express router definitions mapping to controllers
├── services/         # Complex business logic and external API calls (Payments, AI)
├── utils/            # Helper functions (Upload to Cloudinary, formatting)
├── .env              # Environment variables
├── package.json      # Dependencies
└── server.js         # Express app instantiation and server listening
```

## API Endpoint Overview

*   **`/api/auth`**: Registration, Login, Logout, and User Session validation.
*   **`/api/users`**: Profile management and Seller onboarding.
*   **`/api/products`**: CRUD operations for marketplace listings, including AI-enriched manual creation endpoints.
*   **`/api/cart`**: Manage user shopping sessions.
*   **`/api/orders`**: Checkout processes, seller order fulfillment, and dashboard analytics.
*   **`/api/payments`**: Intent creation and Webhook listeners for Stripe and Razorpay.
*   **`/api/reviews`**: Authenticated creation and fetching of product reviews and ratings.

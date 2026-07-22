# Kalastra Server - Artisan Marketplace Backend

Welcome to the backend repository of the **Kalastra** application! This is a robust, scalable Express/Node.js REST API designed to power the Kalastra artisan marketplace. It handles everything from user authentication and database management to complex third-party AI and payment integrations.

## Key Features

*   **Secure Authentication & Authorization:** Implements robust JWT-based authentication with bcrypt password hashing. Includes Role-Based Access Control (RBAC) to differentiate between standard `users` and `sellers`.
*   **Full E-Commerce API:** Complete RESTful endpoints for managing Users, Products, Carts, Orders, and Reviews.
*   **AI Integration (Groq):** Powered by **Groq (Llama-3.1)** to automatically enrich product listings with SEO tags, engaging descriptions, and reach probability analysis.
*   **Speech-to-Text Integration:** Enables sellers to upload audio files which are transcribed and fed into the AI pipeline for seamless product listing creation.
*   **Cloud Storage Integration:** Utilizes Cloudinary to securely store and serve product images and user avatars.
*   **Payment Gateway Integration:** Fully integrated with **Stripe**, including secure webhook endpoints to automatically verify transactions and update order statuses. **Razorpay** support is currently integrated at the controller level.
*   **Inventory Management:** Comprehensive stock tracking. Automatically deducts stock upon successful payment and restores stock if an order is cancelled. Sellers can also manually toggle product status (active/discontinued).
*   **Seller Analytics:** Provides real-time dashboard stats including revenue tracking, order counts, and monthly performance charts.

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **AI:** Groq SDK (Llama-3.1)
*   **Speech-to-Text:** DeepGram / Google Cloud Speech
*   **Payments:** Stripe SDK, Razorpay SDK
*   **Storage:** Cloudinary

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   MongoDB Instance (Local or Atlas)
*   API Keys for Stripe, Groq, and Cloudinary.

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
   GROQ_API_KEY=<your-groq-api-key>
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   
   # Payments
   STRIPE_SECRET_KEY=<your-stripe-secret>
   STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

The project follows the MVC (Model-View-Controller) architecture pattern:

```
server/
├── config/           # Initialization for third-party services (Cloudinary, DB)
├── controllers/      # Route logic and response formatting
├── middlewares/      # Express middlewares (Auth validation, Multer file processing)
├── models/           # Mongoose schemas (User, Product, Order, Review)
├── routes/           # Express router definitions mapping to controllers
├── services/         # Complex business logic and external API calls (Groq, Payments)
├── utils/            # Helper functions (Upload to Cloudinary, formatting)
├── server.js         # Express app instantiation and server listening
```

## API Endpoint Overview

*   **`/api/auth`**: Registration, Login, and User Session validation.
*   **`/api/users`**: Profile management and Seller onboarding with email OTP verification.
*   **`/api/products`**: CRUD operations for marketplace listings, including Groq-powered enrichment (`/enrich`).
*   **`/api/cart`**: Manage user shopping sessions.
*   **`/api/orders`**: Checkout processes, seller order fulfillment, and dashboard stats (`/stats`).
*   **`/api/payments`**: Intent creation and Webhook listeners for Stripe.
*   **`/api/reviews`**: Authenticated creation and fetching of product reviews.

# Backend API

This is the backend API for the Kalastra application, a platform for artisans to showcase and sell their products.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Artisans](#artisans)
  - [Products](#products)
  - [Cart](#cart)
  - [Orders](#orders)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Contributing](#contributing)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kalastra-backend.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Add the following environment variables to the `.env` file:

   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   FIREBASE_PROJECT_ID=<your-firebase-project-id>
   FIREBASE_PRIVATE_KEY=<your-firebase-private-key>
   FIREBASE_CLIENT_EMAIL=<your-firebase-client-email>
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

## Running the Application

To start the server, run the following command:

```bash
npm start
```

The server will start on the port specified in the `.env` file (default is 5000).

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login a user.
- `GET /api/auth/me`: Get the current user's profile.
- `POST /api/auth/logout`: Logout a user.

### Users

- `DELETE /api/users/delete`: Delete a user's profile.
- `PATCH /api/users/switch-artisan`: Switch a user's profile to an artisan profile.

### Artisans

- `GET /api/artisans/:id`: Get an artisan's profile.
- `PUT /api/artisans/update`: Update an artisan's profile.
- `GET /api/artisans/:id/products`: Get an artisan's products.

### Products

- `GET /api/products`: Get all products.
- `GET /api/products/:id`: Get a single product by its ID.
- `POST /api/products/manual`: Create a new product with manual input.
- `POST /api/products/ai`: Create a new product using AI assistance (with audio/image).

### Cart

- `POST /api/cart/add`: Add a product to the cart.
- `DELETE /api/cart/remove/:productId`: Remove a product from the cart.
- `GET /api/cart`: Get all items in the user's cart.

### Orders

- `POST /api/orders`: Create a new order (checkout).
- `GET /api/orders`: Get all orders for the logged-in user.
- `GET /api/orders/:orderId`: Get a specific order by its ID.
- `DELETE /api/orders/:orderId`: Cancel an order.

## Project Structure

```
.
├── config
│   └── firebase.js
├── controllers
│   ├── artisanController.js
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── productController.js
│   └── userController.js
├── db
│   └── db.js
├── middlewares
│   └── auth.middleware.js
├── models
│   ├── Artisan.model.js
│   ├── Cart.models.js
│   ├── Order.model.js
│   ├── Product.model.js
│   └── User.model.js
├── routes
│   ├── artisanRoutes.js
│   ├── authRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── userRoutes.js
├── services
│   ├── geminiService.js
│   ├── speechToTextService.js
│   └── storageService.js
├── utils
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Dependencies

- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [firebase-admin](https://www.npmjs.com/package/firebase-admin)
- [mongoose](https://www.npmjs.com/package/mongoose)

## Contributing

Contributions are welcome! Please feel free to submit a pull request.


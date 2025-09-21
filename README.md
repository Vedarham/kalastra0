# Kalastra - Artisan Marketplace

Kalastra is a full-stack e-commerce platform designed for artisans and creators to showcase and sell their handmade products. It features a modern, responsive user interface and a robust backend, enhanced with AI-powered features to improve user experience.

## Project Overview

The platform serves as a digital marketplace where users can browse and purchase unique, handcrafted items. Creators can manage their own profiles, list products, and track their sales. Key features include an AI-powered chatbot for customer support and a novel speech-to-text functionality that allows sellers to list products simply by describing them verbally.

## Tech Stack

The project is a monorepo divided into a `client` and a `Server`.

### Client

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Framework** | React (with Vite)                                |
| **Language**  | TypeScript                                       |
| **Styling**   | Tailwind CSS                                     |
| **UI Library**| shadcn/ui                                        |
| **State Mgmt**| React Context API                                |
| **Package Mgr**| `npm` / `bun`                                    |

### Server

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Runtime**   | Node.js                                          |
| **Framework** | Express.js                                       |
| **Database**  | MongoDB (with Mongoose ODM)                      |
| **Auth**      | JSON Web Tokens (JWT)                            |
| **Services**  | Firebase (Storage), Google Gemini, DeepGram Speech-to-Text |

---

## Project Structure

```
Kalastra/
├── server/
│   ├── controllers/  # Request handlers (MVC Controller)
│   ├── models/       # Mongoose schemas for MongoDB
│   ├── routes/       # API endpoint definitions
│   ├── services/     # Business logic for external APIs (Gemini, Firebase)
│   ├── middlewares/  # Custom middleware (e.g., auth)
│   ├── config/       # Configuration files (e.g., Firebase admin)
│   └── server.js     # Main server entry point
│
└── client/
    ├── src/
    │   ├── pages/        # Top-level page components
    │   ├── components/   # Reusable React components (UI and logic)
    │   ├── contexts/     # Global state management (e.g., CartContext)
    │   ├── hooks/        # Custom React hooks
    │   ├── assets/       # Static assets like images and videos
    │   └── main.tsx      # Main application entry point
    └── vite.config.ts    # Vite build configuration
```

### Key Directories

-   **`server/controllers`**: Contains the logic to handle incoming API requests, interact with models, and send responses.
-   **`server/models`**: Defines the data structure for the application's database collections (Users, Products, Orders, etc.).
-   **`server/routes`**: Maps API endpoints (e.g., `/api/products`) to the corresponding controller functions.
-   **`server/services`**: Encapsulates logic for interacting with third-party services like Google Gemini for the chatbot and Firebase for file storage.
-   **`client/pages`**: Each file corresponds to a major route/view in the application (e.g., Marketplace, Profile).
-   **`client/components`**: Contains a library of reusable components, from basic UI elements in `components/ui` to complex features like the `ChatBot`.
-   **`client/contexts`**: Provides global state for features like the shopping cart, making state accessible across the component tree.

## APIs & Services

-   **Internal REST API**: The `server` exposes a RESTful API for all standard CRUD (Create, Read, Update, Delete) operations related to users, products, carts, and orders.
-   **Google Gemini API**: Powers the intelligent chatbot, providing users with assistance and product recommendations.
-   **Google Speech-to-Text API**: Used in the `AudioListingForm` to transcribe a creator's spoken product description into text, simplifying the product listing process.
-   **Firebase Storage**: Used for hosting and serving user-uploaded content, such as product images and profile pictures.


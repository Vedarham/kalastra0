# Kalastra Client - Artisan Marketplace Frontend

Welcome to the frontend repository of the **Kalastra** application! This represents the user-facing side of a modern e-commerce platform dedicated to connecting artisans with buyers. Initially bootstrapped using Lovable for a rapid UI foundation, the codebase has undergone extensive manual improvement to connect it to a robust backend, transitioning the UI from mock states to dynamic, database-driven React components.

## Key Features

*   **Responsive Artisan Marketplace:** Browse, filter, and discover unique handcrafted items. Uses backend-driven filtering for dynamic category sorting.
*   **Seller Dashboard:** A dedicated space for creators to manage their storefront. Fully integrated with REST APIs to Create, Read, Update, and Delete (CRUD) their product listings.
*   **Voice-to-Text Listing:** Simplifies product creation for artisans by allowing them to dictate product descriptions, which are then enhanced via AI.
*   **AI-Powered Chatbot (KalaBot):** Provides an interactive way for users to search for products using natural language ("show me blue pottery under $50").
*   **Integrated Shopping Cart & Checkout:** Secure payment integrations offering support for multiple payment gateways (Stripe & Razorpay).
*   **Verified Customer Reviews:** Authenticated users can leave reviews and star ratings on delivered orders, which display dynamically on product modals.
*   **Secure User Profiles:** Manage personal information, location details, notification preferences, and securely update passwords.

## Tech Stack

This frontend is designed for high performance, maintainability, and a premium aesthetic.

*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (configured with CSS variables for dynamic theming)
*   **UI Components:** shadcn/ui & Radix UI primitives
*   **Routing:** React Router v6
*   **State Management:** React Context API & Custom Hooks
*   **Forms:** React Hook Form
*   **Icons:** Lucide React

## Getting Started

To get a local copy up and running:

### Prerequisites

*   Node.js (v18 or later)
*   npm or bun

### Installation

1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install NPM packages:
   ```sh
   npm install
   ```
3. Set up environment variables by copying the example file (if present) and adding your backend URL.
4. Start the development server:
   ```sh
   npm run dev
   ```

## Folder Structure

The project follows a standard Vite/React structure, organized for scalability:

```
client/
├── public/           # Static assets that don't require bundling
├── src/              
│   ├── api/          # Axios interceptors and centralized API service functions
│   ├── assets/       # Images, icons, and global CSS (index.css)
│   ├── components/   # Reusable UI elements (Buttons, Dialogs, ProductCards)
│   ├── contexts/     # Global state providers (AuthContext, CartContext)
│   ├── hooks/        # Custom React hooks (e.g., use-toast)
│   ├── lib/          # Utility functions (e.g., tailwind merge utilities)
│   ├── pages/        # Top-level route components (Marketplace, Profile, Settings)
│   ├── types/        # TypeScript interface definitions
│   ├── App.tsx       # Root component and Router configuration
│   └── main.tsx      # React entry point
├── package.json      # Dependencies and scripts
└── vite.config.ts    # Vite build and plugin configuration
```

## Continuous Improvement
This client application is a living document of modern React practices. It continually evolves as more mock data is replaced with optimized API calls and as new interactive features are added.

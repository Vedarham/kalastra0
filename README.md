# Kalastra - Artisan Marketplace

Kalastra is a full-stack e-commerce platform designed for artisans and creators to showcase and sell their handmade products. It features a modern, responsive user interface and a robust backend, enhanced with AI-powered features to improve the user experience.

## Development Journey & Improvements

The frontend of this application was initially generated using **Lovable**, providing a beautiful and functional UI foundation. From there, the project has been a hands-on learning experience focused on **necessary improvements and full-stack integrations**. 

### Purpose of Improvements
The primary goal of the ongoing improvements has been to bridge the gap between a static, generated frontend and a fully functional, production-ready backend. This includes:
- Replacing mock data with dynamic database interactions.
- Securing API routes and implementing robust authentication/authorization.
- Refining complex user flows like the Seller Dashboard (CRUD operations) and secure Profile Management.
- Integrating real-time and third-party APIs (Groq, Cloudinary, Speech-to-Text).
- Learning and applying best practices in MERN stack architecture, state management, and RESTful API design.

## Tech Stack

The project is a monorepo divided into a `client` (Frontend) and a `server` (Backend).

### Client

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Framework** | React (with Vite)                                |
| **Language**  | TypeScript                                       |
| **Styling**   | Tailwind CSS                                     |
| **UI Library**| shadcn/ui                                        |
| **State Mgmt**| React Context API                                |
| **Routing**   | React Router                                     |

### Server

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Runtime**   | Node.js                                          |
| **Framework** | Express.js                                       |
| **Database**  | MongoDB (with Mongoose ODM)                      |
| **Auth**      | JSON Web Tokens (JWT) & bcrypt                   |
| **Services**  | Cloudinary (Storage), Groq (AI), DeepGram (Speech-to-Text), Google Translate (Free Regional Translation) |
| **Payments**  | Stripe (Full), Razorpay (Partial)               |

---

## Project Structure

```
Kalastra/
├── server/
│   ├── controllers/  # Request handlers (MVC Controller)
│   ├── models/       # Mongoose schemas for MongoDB
│   ├── routes/       # API endpoint definitions
│   ├── services/     # Business logic for external APIs (Groq)
│   ├── middlewares/  # Custom middleware (e.g., auth, role validation, upload)
│   ├── config/       # Configuration files (e.g., Cloudinary, DB)
│   └── server.js     # Main server entry point
│
└── client/
    ├── src/
    │   ├── pages/        # Top-level page components (Marketplace, Dashboard)
    │   ├── components/   # Reusable React components (UI and logic)
    │   ├── contexts/     # Global state management (Auth, Cart)
    │   ├── api/          # Axios interceptors and API service functions
    │   ├── assets/       # Static assets like images and icons
    │   └── main.tsx      # Main application entry point
    └── vite.config.ts    # Vite build configuration
```

## Key Features

- **Artisan Marketplace:** Browse, filter, and purchase unique handcrafted items with dynamic, backend-driven category sorting, inline query auto-clear, and typewriter-animated search.
- **Seller Dashboard:** Comprehensive product management allowing artisans to Add, Edit, and Delete their listings while viewing performance metrics.
- **Guest Demo Mode:** Fully interactive demo dashboard for site scrollers. Populates stats widgets, revenue area charts, category bars, product inventories, and recent orders with robust mock datasets. All mutative actions are intercepted with artisan account role guard toasts.
- **Visual Progress Feedback:** Integrated layout-matched, pulsing Tailwind skeleton lists (for products and orders) and save actions' feedback loaders to make transitions feel fluid and professional.
- **Inventory Management:** Sellers can manage stock quantities and toggle product availability (Active/Discontinued) directly from their dashboard.
- **AI-Powered Enrichment & Translation:** Utilizing **Groq (Llama-3.1)** and a free Google Translation API wrapper.
  - **Voice-to-Text Listing:** Speak in regional Indian languages (Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati) to list products. The application transcribes, translates to English, and enriches the product listing with AI.
  - **Regional Language Helper (Translator):** Side widget card allowing artisans to enter text in local scripts, translate it to English, and map it directly to fields (like Title or Description) with a single click.
- **Review System:** Authenticated users can leave reviews and star ratings on products they have purchased.
- **Secure Profiles:** Users can manage their personal details, preferences, and securely update their passwords.
- **Artisan Verification:** Identity verification for sellers using email-based OTP to ensure platform authenticity and trust.
- **Secure Payments:** Fully integrated with **Stripe** for secure checkouts. Razorpay support is currently in partial development.
- **Artisan-Themed 404 Page:** Warm clay-gradient background, custom illustrations, and dynamic guest routing options to redirect users seamlessly.

## Future Roadmap
- Completing full Razorpay integration with webhook support.
- Enhancing the notification system (Email/SMS).
- Adding real-time chat between buyers and sellers.
- Implementing advanced seller analytics and global shipping options.

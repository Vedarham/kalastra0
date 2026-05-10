import express from 'express'
import dotenv from "dotenv";
dotenv.config();

import cors from 'cors'
import cookieParser from "cookie-parser";
import passport from 'passport';
import rateLimit from 'express-rate-limit';

import { connectDB } from './db/db.js'
import './config/passport.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import artisanRoutes from './routes/artisanRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import supportRoutes from './routes/supportRoutes.js'
import { stripeWebhook } from './controllers/paymentController.js';

const app = express()
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use("/api/payments/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api/', limiter);

app.get('/', (req, res) => {
  res.send('Kalastra by Vedarham!');
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/artisans', artisanRoutes)
app.use('/api/products', productRoutes)
// app.use('/api/notifications', notificationRoutes)
app.use('/api/orders', orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/support', supportRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy: This origin is not allowed.'
    });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

const startServer = async () => {
  try {
    await connectDB();

    // On Vercel, we do NOT call app.listen()
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export default app
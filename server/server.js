import express from 'express' 
import dotenv from "dotenv";
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
import paymentRouter from './routes/paymentRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import { stripeWebhook } from './controllers/paymentController.js';

const app = express()
dotenv.config();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
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
app.use("/api/payments", paymentRouter);
app.use('/api/reviews', reviewRoutes);

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

startServer();

export default app
import express from 'express' 
import 'dotenv/config'
import cors from 'cors'
import { connectDB } from './db/db.js'

import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'  
import orderRoutes from './routes/orderRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'

await connectDB()
const app = express()

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));


app.get('/', (req, res) => {
  res.send('Kalastra by Vedarham!');
});

app.get('/test',(req,res)=>{
    res.send('Testing API successful')
})


app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
// app.use('/api/notifications', notificationRoutes)
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

if (process.env.NODE_ENV !== 'production' ) {
 const PORT = process.env.PORT || 5000 
app.listen(PORT, () => { console.log('Server is running on PORT:' + PORT) })}

export default app
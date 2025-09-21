import express from 'express' 
import 'dotenv/config'
import cors from 'cors'
import { connectDB } from './db/db.js'
const app = express()
app.use(express.json({ limit: '4mb' }))
app.use(cors())
await connectDB()

app.get('/', (req, res) => {
  res.send('Kalastra by Quadrant!');
});

app.get('/test',(req,res)=>{
    res.send('Testing API successful')
})

import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'     
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
if (process.env.NODE_ENV !== 'production' ) {
 const PORT = process.env.PORT || 5000 
app.listen(PORT, () => { console.log('Server is running on PORT:' + PORT) })}

export default app
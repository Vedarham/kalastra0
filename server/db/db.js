import mongoose from 'mongoose'

export const connectDB = async()=>{
try{
mongoose.connection.on('connected',()=>{console.log('Database Connected...')})
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'kalastra' });
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
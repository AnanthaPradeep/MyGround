import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    // In production, MONGODB_URI is REQUIRED
    if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
      console.error('❌ FATAL ERROR: MONGODB_URI is required in production!');
      console.error('❌ Please set MONGODB_URI environment variable in your hosting platform.');
      console.error('❌ Server will not start without a valid MongoDB connection string.');
      process.exit(1);
    }
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';
    
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  WARNING: MONGODB_URI not set, using default localhost (development only)');
    } else {
      console.log('📦 Using MongoDB URI from environment variable');
    }
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};


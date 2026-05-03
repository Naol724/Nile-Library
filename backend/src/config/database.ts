import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.log('💡 Please check your .env file and ensure MONGODB_URI is set');
      console.log('💡 Example: mongodb+srv://username:password@cluster.mongodb.net/dbname');
      return;
    }

    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    console.log(`📍 Connection URI: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials in logs

    const conn = await mongoose.connect(mongoURI, {
      // Connection options for better reliability
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false // Disable mongoose buffering
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️ Database: ${conn.connection.name}`);
    
    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      if (err.name === 'MongooseServerSelectionError') {
        console.log('💡 Possible solutions:');
        console.log('   1. Check if your IP is whitelisted in MongoDB Atlas');
        console.log('   2. Verify your connection string and credentials');
        console.log('   3. Ensure network connectivity to MongoDB Atlas');
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.log('💡 MongoDB Atlas connection failed. Possible solutions:');
      console.log('   1. Add your IP to MongoDB Atlas whitelist (0.0.0.0/0 for any IP)');
      console.log('   2. Check username/password in connection string');
      console.log('   3. Verify cluster name and database name');
      console.log('   4. Ensure MongoDB Atlas cluster is running');
    }
    
    // Don't exit the process - allow app to run without DB
    console.log('⚠️ Continuing without database connection...');
  }
};

export default connectDB;

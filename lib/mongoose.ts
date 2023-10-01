import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI) {
        throw new Error('No MONGODB_URI found in environment variables');
    }
    if (isConnected) return console.log("Already Connected");

    try {
       await mongoose.connect(process.env.MONGODB_URI)
       const dbName = 'treads';
       const db = mongoose.connection.useDb(dbName);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        
    }
    
};
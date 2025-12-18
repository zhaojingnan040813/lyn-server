import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'diet_recommendation';

/**
 * 连接MongoDB数据库
 */
export const connectDatabase = async () => {
    try {
        const options = {
            dbName: DB_NAME,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log(`✅ MongoDB connected successfully to database: ${DB_NAME}`);

        // 监听连接事件
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });

    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

/**
 * 断开数据库连接
 */
export const disconnectDatabase = async () => {
    try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error.message);
    }
};

export default { connectDatabase, disconnectDatabase };

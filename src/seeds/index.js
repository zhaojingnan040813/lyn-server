import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Constitution, Recipe } from '../models/index.js';
import constitutionSeeds from './constitutionSeeds.js';
import recipeSeeds from './recipeSeeds.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'diet_recommendation';

/**
 * 初始化种子数据
 */
const seedDatabase = async () => {
    try {
        // 连接数据库
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            dbName: DB_NAME,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB connected successfully');

        // ========== 体质数据 ==========
        console.log('\n🗑️ Clearing existing constitution data...');
        await Constitution.deleteMany({});

        console.log('🌱 Seeding constitution data...');
        const constitutionResult = await Constitution.insertMany(constitutionSeeds);
        console.log(`✅ Successfully seeded ${constitutionResult.length} constitutions`);

        console.log('\n📋 Seeded constitutions:');
        constitutionResult.forEach((c, index) => {
            console.log(`   ${index + 1}. ${c.icon} ${c.name} (${c.type})`);
        });

        // ========== 菜谱数据 ==========
        console.log('\n🗑️ Clearing existing recipe data...');
        await Recipe.deleteMany({});

        console.log('🌱 Seeding recipe data...');
        const recipeResult = await Recipe.insertMany(recipeSeeds);
        console.log(`✅ Successfully seeded ${recipeResult.length} recipes`);

        console.log('\n📋 Seeded recipes:');
        recipeResult.forEach((r, index) => {
            console.log(`   ${index + 1}. ${r.emoji} ${r.name} (${r.nature}性 - ${r.category})`);
        });

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    } finally {
        // 断开连接
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    }
};

// 执行种子脚本
seedDatabase();

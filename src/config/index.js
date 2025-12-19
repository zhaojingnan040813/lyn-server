import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // 服务器配置
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // 数据库配置
    mongodb: {
        uri: process.env.MONGODB_URI,
        dbName: process.env.DB_NAME || 'diet_recommendation'
    },

    // 跨域配置
    cors: {
        origin: '*', // 允许所有域名跨域访问
        credentials: true
    },

    // DeepSeek AI 配置
    deepseek: {
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS) || 2048,
        temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE) || 0.7,
        // JSON Output 功能配置
        enableJsonOutput: process.env.DEEPSEEK_ENABLE_JSON_OUTPUT === 'true',
        jsonOutputModel: process.env.DEEPSEEK_JSON_OUTPUT_MODEL || 'deepseek-chat'
    }
};

export default config;

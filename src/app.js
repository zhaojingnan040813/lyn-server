import Koa from 'koa';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';
import logger from 'koa-logger';
import { koaSwagger } from 'koa2-swagger-ui';
import dotenv from 'dotenv';

import { connectDatabase } from './config/database.js';
import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import errorHandler from './middlewares/errorHandler.js';
import { registerRoutes } from './routes/index.js';

// 加载环境变量
dotenv.config();

// 创建Koa应用
const app = new Koa();

// 中间件配置
// 1. 错误处理
app.use(errorHandler);

// 2. 日志
app.use(logger());

// 3. 跨域
app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Session-Id']
}));

// 4. 请求体解析
app.use(koaBody({
    multipart: true,
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
}));

// 5. Swagger API文档
app.use(
    koaSwagger({
        routePrefix: '/api-docs',
        swaggerOptions: {
            spec: swaggerSpec
        }
    })
);

// 6. API文档JSON端点
app.use(async (ctx, next) => {
    if (ctx.path === '/api-docs.json') {
        ctx.body = swaggerSpec;
        return;
    }
    await next();
});

// 7. 健康检查端点
app.use(async (ctx, next) => {
    if (ctx.path === '/health') {
        ctx.body = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: config.nodeEnv
        };
        return;
    }
    await next();
});

// 注册路由
registerRoutes(app);

// 启动服务器
const startServer = async () => {
    try {
        // 连接数据库
        await connectDatabase();

        // 启动HTTP服务
        const PORT = config.port;
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🍽️  智能体质膳食推荐系统 API 服务已启动                  ║
║                                                           ║
║   📍 服务地址: http://localhost:${PORT}                     ║
║   📚 API文档: http://localhost:${PORT}/api-docs              ║
║   🏥 健康检查: http://localhost:${PORT}/health               ║
║   🌍 环境: ${config.nodeEnv.padEnd(45)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
            `);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// 优雅关闭
process.on('SIGTERM', async () => {
    console.log('📴 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('📴 SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// 启动应用
startServer();

export default app;

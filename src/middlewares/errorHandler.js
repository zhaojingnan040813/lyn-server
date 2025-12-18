/**
 * 统一错误响应格式
 */
class AppError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 错误处理中间件
 */
const errorHandler = async (ctx, next) => {
    try {
        await next();

        // 处理404
        if (ctx.status === 404 && !ctx.body) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '请求的资源不存在',
                data: null
            };
        }
    } catch (err) {
        // 记录错误日志
        console.error('Error:', err);

        // 判断是否是已知错误
        if (err instanceof AppError) {
            ctx.status = err.statusCode;
            ctx.body = {
                code: err.code,
                message: err.message,
                data: null
            };
        } else if (err.name === 'ValidationError') {
            // Mongoose验证错误
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '数据验证失败',
                data: {
                    errors: Object.values(err.errors).map(e => e.message)
                }
            };
        } else if (err.name === 'CastError') {
            // Mongoose类型转换错误
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '无效的数据格式',
                data: null
            };
        } else if (err.code === 11000) {
            // MongoDB重复键错误
            ctx.status = 409;
            ctx.body = {
                code: 409,
                message: '数据已存在',
                data: null
            };
        } else {
            // 未知错误
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                code: ctx.status,
                message: process.env.NODE_ENV === 'production'
                    ? '服务器内部错误'
                    : err.message,
                data: null
            };
        }
    }
};

export { AppError, errorHandler };
export default errorHandler;

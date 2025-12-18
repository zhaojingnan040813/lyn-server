/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 * @param {Object} ctx - Koa上下文
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 * @param {number} statusCode - HTTP状态码
 */
export const success = (ctx, data = null, message = 'success', statusCode = 200) => {
    ctx.status = statusCode;
    ctx.body = {
        code: 0,
        message,
        data
    };
};

/**
 * 创建成功响应
 * @param {Object} ctx - Koa上下文
 * @param {*} data - 响应数据
 * @param {string} message - 响应消息
 */
export const created = (ctx, data = null, message = '创建成功') => {
    success(ctx, data, message, 201);
};

/**
 * 错误响应
 * @param {Object} ctx - Koa上下文
 * @param {string} message - 错误消息
 * @param {number} code - 错误码
 * @param {number} statusCode - HTTP状态码
 */
export const error = (ctx, message = '操作失败', code = 400, statusCode = 400) => {
    ctx.status = statusCode;
    ctx.body = {
        code,
        message,
        data: null
    };
};

/**
 * 分页响应
 * @param {Object} ctx - Koa上下文
 * @param {Array} list - 数据列表
 * @param {number} total - 总数
 * @param {number} page - 当前页
 * @param {number} pageSize - 每页数量
 * @param {string} message - 响应消息
 */
export const paginate = (ctx, list, total, page, pageSize, message = 'success') => {
    ctx.status = 200;
    ctx.body = {
        code: 0,
        message,
        data: {
            list,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        }
    };
};

export default {
    success,
    created,
    error,
    paginate
};

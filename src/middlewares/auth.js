import { Session, User } from '../models/index.js';
import { error } from '../utils/response.js';

/**
 * 必须认证中间件 - 要求用户必须登录
 */
export const requireAuth = async (ctx, next) => {
    const sessionId = ctx.headers['x-session-id'] || ctx.cookies.get('diet_session_id');

    if (!sessionId) {
        return error(ctx, '未登录', 4006, 401);
    }

    try {
        const session = await Session.findOne({
            sessionId,
            expiresAt: { $gt: new Date() }
        }).populate('userId');

        if (!session) {
            return error(ctx, '会话已过期', 4005, 401);
        }

        ctx.state.user = session.userId;
        ctx.state.session = session;

        // 更新用户最后活跃时间
        await ctx.state.user.updateLastActive();

        await next();
    } catch (err) {
        return error(ctx, '认证失败', 4005, 401);
    }
};

/**
 * 可选认证中间件 - 支持匿名用户和登录用户
 */
export const optionalAuth = async (ctx, next) => {
    const sessionId = ctx.headers['x-session-id'] || ctx.cookies.get('diet_session_id');

    if (sessionId) {
        try {
            const session = await Session.findOne({
                sessionId,
                expiresAt: { $gt: new Date() }
            }).populate('userId');

            if (session) {
                ctx.state.user = session.userId;
                ctx.state.session = session;

                // 更新用户最后活跃时间
                await ctx.state.user.updateLastActive();
            }
        } catch (err) {
            // 可选认证失败时不阻止请求继续
            console.warn('Optional auth failed:', err.message);
        }
    }

    await next();
};

/**
 * 管理员权限中间件 - 要求用户必须是管理员
 */
export const requireAdmin = async (ctx, next) => {
    const sessionId = ctx.headers['x-session-id'] || ctx.cookies.get('diet_session_id');

    if (!sessionId) {
        return error(ctx, '未登录', 4006, 401);
    }

    try {
        const session = await Session.findOne({
            sessionId,
            expiresAt: { $gt: new Date() }
        }).populate('userId');

        if (!session) {
            return error(ctx, '会话已过期', 4005, 401);
        }

        const user = session.userId;
        if (!user || user.role !== 'admin') {
            return error(ctx, '权限不足', 4007, 403);
        }

        ctx.state.user = user;
        ctx.state.session = session;

        // 更新用户最后活跃时间
        await ctx.state.user.updateLastActive();

        await next();
    } catch (err) {
        return error(ctx, '认证失败', 4005, 401);
    }
};

/**
 * 检查用户是否为注册用户（非匿名）
 */
export const requireRegisteredUser = async (ctx, next) => {
    if (!ctx.state.user) {
        return error(ctx, '未登录', 4006, 401);
    }

    if (ctx.state.user.userType === 'anonymous') {
        return error(ctx, '请先注册账号', 4008, 403);
    }

    await next();
};

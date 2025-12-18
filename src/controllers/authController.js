import { success, created, error } from '../utils/response.js';
import {
    register,
    login,
    logout,
    changePassword,
    getCurrentUser,
    refreshSession
} from '../services/authService.js';

/**
 * 用户注册控制器
 */
export const registerController = async (ctx) => {
    const result = await register(ctx.request.body);

    if (!result.success) {
        return error(ctx, result.error, result.code, 400);
    }

    return created(ctx, result.data, '注册成功');
};

/**
 * 用户登录控制器
 */
export const loginController = async (ctx) => {
    const result = await login(ctx.request.body);

    if (!result.success) {
        const statusCode = result.code === 4003 ? 401 : 400;
        return error(ctx, result.error, result.code, statusCode);
    }

    return success(ctx, result.data, '登录成功');
};

/**
 * 用户登出控制器
 */
export const logoutController = async (ctx) => {
    const sessionId = ctx.headers['x-session-id'] || ctx.cookies.get('diet_session_id');
    const result = await logout(sessionId);

    if (!result.success) {
        return error(ctx, result.error, result.code, 400);
    }

    // 清除cookie（如果设置了的话）
    ctx.cookies.set('diet_session_id', '', {
        maxAge: 0,
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    });

    return success(ctx, result.data, '登出成功');
};

/**
 * 修改密码控制器
 */
export const changePasswordController = async (ctx) => {
    const userId = ctx.state.user._id;
    const result = await changePassword(userId, ctx.request.body);

    if (!result.success) {
        return error(ctx, result.error, result.code, 400);
    }

    return success(ctx, result.data, '密码修改成功');
};

/**
 * 获取当前用户信息控制器
 */
export const getCurrentUserController = async (ctx) => {
    const sessionId = ctx.headers['x-session-id'] || ctx.cookies.get('diet_session_id');
    const result = await getCurrentUser(sessionId);

    if (!result.success) {
        const statusCode = result.code === 4005 ? 401 : 400;
        return error(ctx, result.error, result.code, statusCode);
    }

    return success(ctx, result.data, 'success');
};

/**
 * 刷新会话控制器
 */
export const refreshSessionController = async (ctx) => {
    const sessionId = ctx.headers['x-session-id'] || ctx.cookies.get('diet_session_id');
    const result = await refreshSession(sessionId);

    if (!result.success) {
        return error(ctx, result.error, result.code, 400);
    }

    return success(ctx, result.data, '会话刷新成功');
};

/**
 * 检查登录状态控制器
 */
export const checkAuthStatusController = async (ctx) => {
    const sessionId = ctx.headers['x-session-id'] || ctx.cookies.get('diet_session_id');

    if (!sessionId) {
        return success(ctx, { authenticated: false }, '未登录');
    }

    const result = await getCurrentUser(sessionId);

    if (!result.success) {
        return success(ctx, { authenticated: false }, '未登录');
    }

    return success(ctx, {
        authenticated: true,
        user: result.data.user
    }, '已登录');
};

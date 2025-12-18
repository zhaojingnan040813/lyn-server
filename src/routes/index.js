import sessionRouter from './session.js';
import constitutionRouter from './constitution.js';
import preferenceRouter from './preference.js';
import recipeRouter from './recipe.js';
import chatRouter from './chat.js';
import authRouter from './auth.js';
import userRouter from './user.js';

/**
 * 注册所有路由
 * @param {Koa} app - Koa应用实例
 */
export const registerRoutes = (app) => {
    // 认证路由
    app.use(authRouter.routes());
    app.use(authRouter.allowedMethods());

    // 用户路由
    app.use(userRouter.routes());
    app.use(userRouter.allowedMethods());

    // 会话路由
    app.use(sessionRouter.routes());
    app.use(sessionRouter.allowedMethods());

    // 体质路由
    app.use(constitutionRouter.routes());
    app.use(constitutionRouter.allowedMethods());

    // 偏好路由
    app.use(preferenceRouter.routes());
    app.use(preferenceRouter.allowedMethods());

    // 菜谱路由
    app.use(recipeRouter.routes());
    app.use(recipeRouter.allowedMethods());

    // AI 对话路由
    app.use(chatRouter.routes());
    app.use(chatRouter.allowedMethods());
};

export default registerRoutes;

import Router from 'koa-router';
import {
    registerController,
    loginController,
    logoutController,
    changePasswordController,
    getCurrentUserController,
    refreshSessionController,
    checkAuthStatusController
} from '../controllers/authController.js';
import { requireAuth, optionalAuth } from '../middlewares/auth.js';
import { validate, registerSchema, loginSchema, changePasswordSchema } from '../middlewares/validation.js';

const router = new Router({
    prefix: '/api/auth'
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 用户注册
 *     description: 创建新的用户账号
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 description: 用户名，3-20位字母数字下划线
 *                 example: testuser123
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: 密码，至少6位字符
 *                 example: password123
 *     responses:
 *       201:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         sessionId:
 *                           type: string
 *                           description: 会话ID
 *                           example: 550e8400-e29b-41d4-a716-446655440000
 *       400:
 *         description: 注册失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validate(registerSchema), registerController);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 用户登录
 *     description: 使用用户名密码登录系统
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *                 example: testuser123
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: password123
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         sessionId:
 *                           type: string
 *                           description: 新的会话ID
 *                           example: 550e8400-e29b-41d4-a716-446655440000
 *       401:
 *         description: 登录失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', validate(loginSchema), loginController);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 用户登出
 *     description: 用户退出登录，清除会话
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *     responses:
 *       200:
 *         description: 登出成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: 未登录或会话过期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', logoutController);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: 获取当前用户信息
 *     description: 获取当前登录用户的详细信息
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: false
 *         schema:
 *           type: string
 *         description: 会话ID（可选）
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: 未登录或会话过期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', optionalAuth, getCurrentUserController);

/**
 * @swagger
 * /api/auth/password:
 *   put:
 *     tags:
 *       - Auth
 *     summary: 修改密码
 *     description: 修改当前用户的密码
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: 当前密码
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 description: 新密码，至少6位字符
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: 修改成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: 修改失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未登录或会话过期
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/password', requireAuth, validate(changePasswordSchema), changePasswordController);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: 刷新会话
 *     description: 延长会话过期时间
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: false
 *         schema:
 *           type: string
 *         description: 会话ID（可选）
 *     responses:
 *       200:
 *         description: 刷新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                           description: 新的过期时间
 *       400:
 *         description: 刷新失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', refreshSessionController);

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     tags:
 *       - Auth
 *     summary: 检查登录状态
 *     description: 检查当前会话的登录状态
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: false
 *         schema:
 *           type: string
 *         description: 会话ID（可选）
 *     responses:
 *       200:
 *         description: 检查成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         authenticated:
 *                           type: boolean
 *                           description: 是否已登录
 *                           example: true
 *                         user:
 *                           $ref: '#/components/schemas/User'
 */
router.get('/status', optionalAuth, checkAuthStatusController);

export default router;

import Router from 'koa-router';
import {
    getUsersController,
    getUserByIdController,
    updateUserController,
    setConstitutionController,
    getConstitutionController,
    deleteUserController,
    upgradeUserController,
    getUserStatsController
} from '../controllers/userController.js';
import { requireAuth, optionalAuth, requireAdmin } from '../middlewares/auth.js';
import { validate, constitutionSchema, registerSchema } from '../middlewares/validation.js';

const router = new Router({
    prefix: '/api/user'
});

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: 获取用户列表
 *     description: 获取系统中所有用户的列表（仅管理员）
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 管理员会话ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: 每页数量
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [anonymous, registered, admin]
 *         description: 按用户类型筛选
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 关键词搜索（用户名）
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
 *                         list:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/User'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: 未登录或权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', requireAuth, requireAdmin, getUsersController);

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: 获取用户详情
 *     description: 根据用户ID获取用户详细信息
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
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
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', requireAuth, getUserByIdController);

/**
 * @swagger
 * /api/user:
 *   put:
 *     tags:
 *       - User
 *     summary: 更新用户信息
 *     description: 更新当前用户的基本信息
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
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-zA-Z0-9_]+$'
 *                 description: 新用户名
 *                 example: newusername123
 *     responses:
 *       200:
 *         description: 更新成功
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
 *       400:
 *         description: 更新失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/', requireAuth, updateUserController);

/**
 * @swagger
 * /api/user/constitution:
 *   post:
 *     tags:
 *       - User
 *     summary: 设置用户体质
 *     description: 为当前用户设置体质类型
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
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [balanced, qi_deficiency, yang_deficiency, yin_deficiency, phlegm_dampness, damp_heat, blood_stasis, qi_stagnation, special]
 *                 description: 体质类型
 *                 example: balanced
 *               diagnosisMethod:
 *                 type: string
 *                 enum: [manual, ai]
 *                 default: manual
 *                 description: 诊断方式
 *                 example: manual
 *     responses:
 *       200:
 *         description: 设置成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: 设置失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/constitution', requireAuth, validate(constitutionSchema), setConstitutionController);

/**
 * @swagger
 * /api/user/constitution:
 *   get:
 *     tags:
 *       - User
 *     summary: 获取用户体质信息
 *     description: 获取当前用户的体质信息
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
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
 *                         constitution:
 *                           $ref: '#/components/schemas/Constitution'
 */
router.get('/constitution', requireAuth, getConstitutionController);

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: 删除用户
 *     description: 删除指定用户（仅管理员）
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 管理员会话ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要删除的用户ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: 用户不存在
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', requireAuth, requireAdmin, deleteUserController);

/**
 * @swagger
 * /api/user/upgrade:
 *   post:
 *     tags:
 *       - User
 *     summary: 升级匿名用户为注册用户
 *     description: 将当前匿名用户升级为注册用户
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 匿名用户的会话ID
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
 *                 description: 用户名
 *                 example: newregistereduser
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: 密码
 *                 example: password123
 *     responses:
 *       200:
 *         description: 升级成功
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
 *       400:
 *         description: 升级失败
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/upgrade', requireAuth, validate(registerSchema), upgradeUserController);

/**
 * @swagger
 * /api/user/stats:
 *   get:
 *     tags:
 *       - User
 *     summary: 获取用户统计信息
 *     description: 获取系统用户统计信息（仅管理员）
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 管理员会话ID
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
 *                         totalUsers:
 *                           type: integer
 *                           description: 总用户数
 *                           example: 100
 *                         anonymousUsers:
 *                           type: integer
 *                           description: 匿名用户数
 *                           example: 30
 *                         registeredUsers:
 *                           type: integer
 *                           description: 注册用户数
 *                           example: 65
 *                         adminUsers:
 *                           type: integer
 *                           description: 管理员数
 *                           example: 5
 *                         usersWithConstitution:
 *                           type: integer
 *                           description: 已设置体质的用户数
 *                           example: 80
 *                         activeSessions:
 *                           type: integer
 *                           description: 活跃会话数
 *                           example: 25
 *       403:
 *         description: 权限不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/stats', requireAuth, requireAdmin, getUserStatsController);

export default router;

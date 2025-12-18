import { Constitution, User } from '../models/index.js';
import { success, error } from '../utils/response.js';

/**
 * @swagger
 * /api/constitutions:
 *   get:
 *     summary: 获取所有体质类型
 *     tags: [Constitution]
 *     description: 获取系统中所有可用的体质类型列表
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       characteristics:
 *                         type: array
 *                         items:
 *                           type: string
 */
export const getConstitutions = async (ctx) => {
    const constitutions = await Constitution.find({ isActive: true })
        .sort({ sortOrder: 1 })
        .select('-__v');

    success(ctx, constitutions);
};

/**
 * @swagger
 * /api/constitutions/{type}:
 *   get:
 *     summary: 获取指定体质详情
 *     tags: [Constitution]
 *     description: 根据体质类型获取详细信息
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *         description: 体质类型标识
 *     responses:
 *       200:
 *         description: 获取成功
 *       404:
 *         description: 体质类型不存在
 */
export const getConstitutionByType = async (ctx) => {
    const { type } = ctx.params;

    const constitution = await Constitution.findOne({ type, isActive: true })
        .select('-__v');

    if (!constitution) {
        return error(ctx, '体质类型不存在', 404, 404);
    }

    success(ctx, constitution);
};

/**
 * @swagger
 * /api/session/{sessionId}/constitution:
 *   put:
 *     summary: 设置用户体质
 *     tags: [Constitution]
 *     description: 为用户设置体质类型
 *     parameters:
 *       - in: path
 *         name: sessionId
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
 *               - constitutionType
 *             properties:
 *               constitutionType:
 *                 type: string
 *                 description: 体质类型标识
 *                 example: "qi_deficiency"
 *               diagnosisMethod:
 *                 type: string
 *                 enum: [manual, ai]
 *                 default: manual
 *                 description: 诊断方式
 *     responses:
 *       200:
 *         description: 设置成功
 *       400:
 *         description: 参数错误
 *       404:
 *         description: 会话或体质类型不存在
 */
export const setUserConstitution = async (ctx) => {
    const { sessionId } = ctx.params;
    const { constitutionType, diagnosisMethod = 'manual' } = ctx.request.body;

    if (!constitutionType) {
        return error(ctx, '体质类型不能为空', 400, 400);
    }

    // 验证体质类型是否存在
    const constitution = await Constitution.findOne({ type: constitutionType, isActive: true });
    if (!constitution) {
        return error(ctx, '无效的体质类型', 400, 400);
    }

    // 查找用户
    const user = await User.findOne({ sessionId });
    if (!user) {
        return error(ctx, '会话不存在', 404, 404);
    }

    // 更新用户体质
    user.constitution = {
        type: constitutionType,
        diagnosisMethod,
        diagnosedAt: new Date()
    };
    user.lastActiveAt = new Date();
    await user.save();

    success(ctx, {
        sessionId: user.sessionId,
        constitution: user.constitution,
        constitutionInfo: {
            name: constitution.name,
            description: constitution.description,
            characteristics: constitution.characteristics,
            dietaryGuidelines: constitution.dietaryGuidelines
        }
    }, '体质设置成功');
};

/**
 * @swagger
 * /api/session/{sessionId}/constitution:
 *   get:
 *     summary: 获取用户体质信息
 *     tags: [Constitution]
 *     description: 获取用户当前的体质类型及详细信息
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *     responses:
 *       200:
 *         description: 获取成功
 *       404:
 *         description: 会话不存在
 */
export const getUserConstitution = async (ctx) => {
    const { sessionId } = ctx.params;

    const user = await User.findOne({ sessionId });
    if (!user) {
        return error(ctx, '会话不存在', 404, 404);
    }

    let constitutionInfo = null;
    if (user.constitution && user.constitution.type) {
        constitutionInfo = await Constitution.findOne({ type: user.constitution.type })
            .select('-__v');
    }

    success(ctx, {
        constitution: user.constitution,
        constitutionInfo
    });
};

export default {
    getConstitutions,
    getConstitutionByType,
    setUserConstitution,
    getUserConstitution
};

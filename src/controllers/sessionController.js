import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/index.js';
import { success, created, error } from '../utils/response.js';

/**
 * @swagger
 * /api/session:
 *   post:
 *     summary: 创建新会话
 *     tags: [Session]
 *     description: 创建匿名用户会话，返回sessionId
 *     responses:
 *       201:
 *         description: 会话创建成功
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
 *                   example: 会话创建成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     user:
 *                       type: object
 */
export const createSession = async (ctx) => {
    const sessionId = uuidv4();

    const user = new User({
        sessionId,
        constitution: {
            type: null,
            diagnosisMethod: null,
            diagnosedAt: null
        }
    });

    await user.save();

    created(ctx, {
        sessionId,
        user: {
            id: user._id,
            constitution: user.constitution,
            createdAt: user.createdAt
        }
    }, '会话创建成功');
};

/**
 * @swagger
 * /api/session/{sessionId}:
 *   get:
 *     summary: 获取会话信息
 *     tags: [Session]
 *     description: 根据sessionId获取用户会话信息
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
 *                   type: object
 *       404:
 *         description: 会话不存在
 */
export const getSession = async (ctx) => {
    const { sessionId } = ctx.params;

    const user = await User.findOne({ sessionId });

    if (!user) {
        return error(ctx, '会话不存在', 404, 404);
    }

    // 更新最后活跃时间
    user.lastActiveAt = new Date();
    await user.save();

    success(ctx, {
        sessionId: user.sessionId,
        user: {
            id: user._id,
            constitution: user.constitution,
            createdAt: user.createdAt,
            lastActiveAt: user.lastActiveAt
        }
    });
};

/**
 * @swagger
 * /api/session/{sessionId}:
 *   delete:
 *     summary: 删除会话
 *     tags: [Session]
 *     description: 删除用户会话及相关数据
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 会话不存在
 */
export const deleteSession = async (ctx) => {
    const { sessionId } = ctx.params;

    const user = await User.findOneAndDelete({ sessionId });

    if (!user) {
        return error(ctx, '会话不存在', 404, 404);
    }

    success(ctx, null, '会话已删除');
};

export default {
    createSession,
    getSession,
    deleteSession
};

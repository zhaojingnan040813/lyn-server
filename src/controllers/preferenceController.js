import { User, UserPreference } from '../models/index.js';
import { success, created, error } from '../utils/response.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     FlavorPreference:
 *       type: object
 *       properties:
 *         sour:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: 酸味偏好程度
 *         sweet:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: 甜味偏好程度
 *         bitter:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: 苦味偏好程度
 *         spicy:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: 辣味偏好程度
 *         salty:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: 咸味偏好程度
 *     UserPreference:
 *       type: object
 *       properties:
 *         flavorPreference:
 *           $ref: '#/components/schemas/FlavorPreference'
 *         dietaryRestrictions:
 *           type: array
 *           items:
 *             type: string
 *           description: 饮食禁忌列表
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *           description: 过敏原列表
 *         dislikedIngredients:
 *           type: array
 *           items:
 *             type: string
 *           description: 不喜欢的食材
 *         currentConditions:
 *           type: array
 *           items:
 *             type: string
 *           description: 当前身体状态
 *         mealScenarios:
 *           type: array
 *           items:
 *             type: string
 *           description: 用餐场景偏好
 *         cookingDifficulty:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: 烹饪难度偏好
 *         maxCookingTime:
 *           type: number
 *           description: 最大烹饪时间（分钟）
 */

/**
 * @swagger
 * /api/preferences:
 *   get:
 *     summary: 获取用户偏好
 *     tags: [Preference]
 *     description: 根据sessionId获取用户的口味偏好设置
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户会话ID
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
 *                 data:
 *                   $ref: '#/components/schemas/UserPreference'
 *       404:
 *         description: 用户或偏好不存在
 */
export const getPreference = async (ctx) => {
    const sessionId = ctx.headers['x-session-id'];

    if (!sessionId) {
        return error(ctx, '缺少会话ID', 400, 400);
    }

    // 查找用户
    const user = await User.findOne({ sessionId });
    if (!user) {
        return error(ctx, '用户不存在', 404, 404);
    }

    // 查找用户偏好
    let preference = await UserPreference.findOne({ userId: user._id });

    // 如果没有偏好记录，返回默认值
    if (!preference) {
        preference = {
            flavorPreference: {
                sour: 50,
                sweet: 50,
                bitter: 50,
                spicy: 50,
                salty: 50
            },
            dietaryRestrictions: [],
            allergies: [],
            dislikedIngredients: [],
            currentConditions: [],
            mealScenarios: [],
            cookingDifficulty: 3,
            maxCookingTime: 60
        };
    }

    success(ctx, preference);
};

/**
 * @swagger
 * /api/preferences:
 *   put:
 *     summary: 更新用户偏好
 *     tags: [Preference]
 *     description: 更新用户的口味偏好设置，支持部分更新
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户会话ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPreference'
 *     responses:
 *       200:
 *         description: 更新成功
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
 *                   example: 偏好更新成功
 *                 data:
 *                   $ref: '#/components/schemas/UserPreference'
 *       400:
 *         description: 请求参数错误
 *       404:
 *         description: 用户不存在
 */
export const updatePreference = async (ctx) => {
    const sessionId = ctx.headers['x-session-id'];

    if (!sessionId) {
        return error(ctx, '缺少会话ID', 400, 400);
    }

    // 查找用户
    const user = await User.findOne({ sessionId });
    if (!user) {
        return error(ctx, '用户不存在', 404, 404);
    }

    const updateData = ctx.request.body;

    // 验证五味偏好数据
    if (updateData.flavorPreference) {
        const flavors = ['sour', 'sweet', 'bitter', 'spicy', 'salty'];
        for (const flavor of flavors) {
            if (updateData.flavorPreference[flavor] !== undefined) {
                const value = updateData.flavorPreference[flavor];
                if (typeof value !== 'number' || value < 0 || value > 100) {
                    return error(ctx, `${flavor}的值必须在0-100之间`, 400, 400);
                }
            }
        }
    }

    // 验证烹饪难度
    if (updateData.cookingDifficulty !== undefined) {
        if (updateData.cookingDifficulty < 1 || updateData.cookingDifficulty > 5) {
            return error(ctx, '烹饪难度必须在1-5之间', 400, 400);
        }
    }

    // 验证烹饪时间
    if (updateData.maxCookingTime !== undefined) {
        if (updateData.maxCookingTime < 0) {
            return error(ctx, '烹饪时间不能为负数', 400, 400);
        }
    }




    // 更新或创建偏好
    const preference = await UserPreference.findOneAndUpdate(
        { userId: user._id },
        {
            userId: user._id,
            ...updateData,
            updatedAt: new Date()
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );

    success(ctx, preference, '偏好更新成功');
};

/**
 * @swagger
 * /api/preferences:
 *   delete:
 *     summary: 重置用户偏好
 *     tags: [Preference]
 *     description: 重置用户的口味偏好为默认值
 *     parameters:
 *       - in: header
 *         name: x-session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户会话ID
 *     responses:
 *       200:
 *         description: 重置成功
 *       404:
 *         description: 用户不存在
 */
export const resetPreference = async (ctx) => {
    const sessionId = ctx.headers['x-session-id'];

    if (!sessionId) {
        return error(ctx, '缺少会话ID', 400, 400);
    }

    // 查找用户
    const user = await User.findOne({ sessionId });
    if (!user) {
        return error(ctx, '用户不存在', 404, 404);
    }

    // 删除现有偏好
    await UserPreference.findOneAndDelete({ userId: user._id });

    // 返回默认偏好
    const defaultPreference = {
        flavorPreference: {
            sour: 50,
            sweet: 50,
            bitter: 50,
            spicy: 50,
            salty: 50
        },
        dietaryRestrictions: [],
        allergies: [],
        dislikedIngredients: [],
        currentConditions: [],
        mealScenarios: [],
        cookingDifficulty: 3,
        maxCookingTime: 60
    };

    success(ctx, defaultPreference, '偏好已重置');
};

export default {
    getPreference,
    updatePreference,
    resetPreference
};

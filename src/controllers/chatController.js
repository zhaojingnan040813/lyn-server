import { chat, chatStream } from '../services/aiService.js';
import { User } from '../models/index.js';
import { success, error } from '../utils/response.js';

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: AI 问诊对话
 *     tags: [Chat]
 *     description: 发送消息与 AI 进行对话
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: 用户消息
 *                 example: "我最近总是感觉疲劳，手脚冰凉，是什么原因？"
 *               history:
 *                 type: array
 *                 description: 历史对话记录
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: 回复成功
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       type: string
 *                       description: AI 回复内容
 */
export const sendMessage = async (ctx) => {
    const { message, history = [] } = ctx.request.body;
    const sessionId = ctx.headers['x-session-id'];

    // 验证参数
    if (!message || !message.trim()) {
        return error(ctx, '消息内容不能为空', 400, 400);
    }

    if (!sessionId) {
        return error(ctx, '会话ID不能为空', 400, 400);
    }

    try {
        // 构建消息列表
        const messages = [
            ...history,
            { role: 'user', content: message }
        ];

        // 调用 AI 服务
        const reply = await chat(messages);

        // 更新用户最后活跃时间
        await User.findOneAndUpdate(
            { sessionId },
            { lastActiveAt: new Date() }
        );

        success(ctx, { reply });
    } catch (err) {
        console.error('Chat Error:', err);
        return error(ctx, err.message || 'AI 服务异常', 500, 500);
    }
};

/**
 * @swagger
 * /api/chat/stream:
 *   post:
 *     summary: AI 问诊流式对话
 *     tags: [Chat]
 *     description: 发送消息与 AI 进行流式对话（SSE）
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: 用户消息
 *               history:
 *                 type: array
 *                 description: 历史对话记录
 *     responses:
 *       200:
 *         description: 流式响应
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 */
export const sendMessageStream = async (ctx) => {
    const { message, history = [] } = ctx.request.body;
    const sessionId = ctx.headers['x-session-id'];

    // 验证参数
    if (!message || !message.trim()) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '消息内容不能为空' };
        return;
    }

    if (!sessionId) {
        ctx.status = 400;
        ctx.body = { code: 400, message: '会话ID不能为空' };
        return;
    }

    try {
        // 设置 SSE 响应头
        ctx.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        });

        // 构建消息列表
        const messages = [
            ...history,
            { role: 'user', content: message }
        ];

        // 流式响应
        const stream = chatStream(messages);

        ctx.status = 200;
        ctx.respond = false;

        for await (const chunk of stream) {
            ctx.res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }

        ctx.res.write('data: [DONE]\n\n');
        ctx.res.end();

        // 更新用户最后活跃时间
        await User.findOneAndUpdate(
            { sessionId },
            { lastActiveAt: new Date() }
        );
    } catch (err) {
        console.error('Chat Stream Error:', err);
        ctx.res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
        ctx.res.end();
    }
};

export default {
    sendMessage,
    sendMessageStream
};

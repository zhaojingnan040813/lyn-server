import Router from 'koa-router';
import { sendMessage, sendMessageStream } from '../controllers/chatController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = new Router({
    prefix: '/api/chat'
});

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: AI 问诊对话接口
 */

// POST /api/chat - 普通对话（需要认证）
router.post('/', requireAuth, sendMessage);

// POST /api/chat/stream - 流式对话（需要认证）
router.post('/stream', requireAuth, sendMessageStream);

export default router;

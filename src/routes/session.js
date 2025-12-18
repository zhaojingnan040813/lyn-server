import Router from 'koa-router';
import sessionController from '../controllers/sessionController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = new Router({
    prefix: '/api/session'
});

// 创建会话（公开接口，支持匿名用户）
router.post('/', sessionController.createSession);

// 获取会话信息（可选认证）
router.get('/:sessionId', optionalAuth, sessionController.getSession);

// 删除会话（可选认证）
router.delete('/:sessionId', optionalAuth, sessionController.deleteSession);

export default router;

import Router from 'koa-router';
import preferenceController from '../controllers/preferenceController.js';
import { optionalAuth, requireAuth } from '../middlewares/auth.js';

const router = new Router({
    prefix: '/api/preferences'
});

/**
 * @swagger
 * tags:
 *   name: Preference
 *   description: 用户口味偏好管理
 */

// 获取用户偏好（可选认证，支持匿名用户）
router.get('/', optionalAuth, preferenceController.getPreference);

// 更新用户偏好（需要认证）
router.put('/', requireAuth, preferenceController.updatePreference);

// 重置用户偏好（需要认证）
router.delete('/', requireAuth, preferenceController.resetPreference);

export default router;

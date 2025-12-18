import Router from 'koa-router';
import constitutionController from '../controllers/constitutionController.js';
import { validate, constitutionSchema } from '../middlewares/validation.js';

const router = new Router();

// 获取所有体质类型
router.get('/api/constitutions', constitutionController.getConstitutions);

// 获取指定体质详情
router.get('/api/constitutions/:type', constitutionController.getConstitutionByType);

// 设置用户体质
router.put('/api/session/:sessionId/constitution', validate(constitutionSchema), constitutionController.setUserConstitution);

// 获取用户体质信息
router.get('/api/session/:sessionId/constitution', constitutionController.getUserConstitution);

export default router;

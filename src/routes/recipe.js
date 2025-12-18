import Router from 'koa-router';
import {
    getRecipes,
    getRecipeById,
    getRecommendedRecipes,
    getRecipeCategories,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    generateRecipeByAI,
    saveAIGeneratedRecipe,
    getAIRecommendations
} from '../controllers/recipeController.js';
import { optionalAuth, requireAuth, requireAdmin } from '../middlewares/auth.js';

const router = new Router({
    prefix: '/api/recipes'
});

/**
 * @swagger
 * tags:
 *   name: Recipe
 *   description: 菜谱相关接口
 */

// 获取推荐菜谱（可选认证，支持个性化推荐）
router.get('/recommend', optionalAuth, getRecommendedRecipes);

// 获取菜谱分类统计（公开接口）
router.get('/categories', getRecipeCategories);

// 获取菜谱列表（公开接口）
router.get('/', getRecipes);

// AI生成菜谱（需要认证）
router.post('/generate', requireAuth, generateRecipeByAI);

// AI智能推荐（需要认证）
router.post('/ai-recommend', requireAuth, getAIRecommendations);

// 保存AI生成的菜谱（需要认证）
router.post('/save-generated', requireAuth, saveAIGeneratedRecipe);

// 创建菜谱（仅管理员）
router.post('/', requireAuth, requireAdmin, createRecipe);

// 获取菜谱详情（公开接口）
router.get('/:id', getRecipeById);

// 更新菜谱（仅管理员）
router.put('/:id', requireAuth, requireAdmin, updateRecipe);

// 删除菜谱（仅管理员）
router.delete('/:id', requireAuth, requireAdmin, deleteRecipe);

export default router;

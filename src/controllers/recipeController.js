import { Recipe, User, UserPreference } from '../models/index.js';
import { success, error } from '../utils/response.js';
import { rankRecipes } from '../services/recommendService.js';
import { generateRecipeJSON, validateRecipeJSON, analyzeUserPreferenceForRecommendation, generatePersonalizedRecommendation, generateAIRecipeRecommendations } from '../services/aiService.js';

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: 获取菜谱列表
 *     tags: [Recipe]
 *     description: 获取菜谱列表，支持分页、筛选、搜索，可根据用户体质和偏好计算匹配度
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [recommended, warming, cooling, quick]
 *         description: 菜谱分类筛选
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 搜索关键词（菜名、描述、食材）
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: 启用状态筛选（true-已启用，false-已禁用，不传则查询所有）
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *       - in: header
 *         name: X-Session-Id
 *         schema:
 *           type: string
 *         description: 会话ID（用于个性化推荐）
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
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         total:
 *                           type: integer
 */
export const getRecipes = async (ctx) => {
    const { category, nature, keyword, isActive, page = 1, pageSize = 10 } = ctx.query;
    const sessionId = ctx.get('X-Session-Id');

    // 构建查询条件
    const query = {};

    // 启用状态筛选（如果提供了isActive参数）
    if (isActive !== undefined && isActive !== '') {
        query.isActive = isActive === 'true';
    }

    // 分类筛选（category字段筛选）
    if (category) {
        query.category = category;
    }

    // 性味筛选
    if (nature) {
        query.nature = nature;
    }

    // 关键词搜索
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { 'ingredients.name': { $regex: keyword, $options: 'i' } },
            { tags: { $regex: keyword, $options: 'i' } }
        ];
    }

    // 获取总数
    const total = await Recipe.countDocuments(query);

    // 获取菜谱列表
    let recipes = await Recipe.find(query)
        .sort({ sortOrder: 1, baseScore: -1, createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(pageSize))
        .limit(parseInt(pageSize))
        .select('-__v');

    // 如果有会话ID，获取用户信息并计算匹配度
    let userProfile = null;
    if (sessionId) {
        const user = await User.findOne({ sessionId });
        if (user) {
            const preferences = await UserPreference.findOne({ userId: user._id });
            userProfile = {
                constitution: user.constitution,
                preferences: preferences ? preferences.toObject() : null
            };
        }
    }

    // 计算匹配度并排序
    let rankedRecipes = rankRecipes(recipes, userProfile);

    success(ctx, {
        list: rankedRecipes,
        pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total
        }
    });
};

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: 获取菜谱详情
 *     tags: [Recipe]
 *     description: 根据ID获取菜谱详细信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 菜谱ID
 *       - in: header
 *         name: X-Session-Id
 *         schema:
 *           type: string
 *         description: 会话ID（用于计算个性化匹配度）
 *     responses:
 *       200:
 *         description: 获取成功
 *       404:
 *         description: 菜谱不存在
 */
export const getRecipeById = async (ctx) => {
    const { id } = ctx.params;
    const sessionId = ctx.get('X-Session-Id');

    const recipe = await Recipe.findById(id).select('-__v');

    if (!recipe) {
        return error(ctx, '菜谱不存在', 404, 404);
    }

    // 计算匹配度
    let matchScore = recipe.baseScore;
    let matchReason = '性味平和，适合日常调养';

    if (sessionId) {
        const user = await User.findOne({ sessionId });
        if (user) {
            const preferences = await UserPreference.findOne({ userId: user._id });
            const userProfile = {
                constitution: user.constitution,
                preferences: preferences ? preferences.toObject() : null
            };

            const ranked = rankRecipes([recipe], userProfile);
            if (ranked.length > 0) {
                matchScore = ranked[0].matchScore;
                matchReason = ranked[0].matchReason;
            }
        }
    }

    const recipeData = recipe.toObject();
    recipeData.matchScore = matchScore;
    recipeData.matchReason = matchReason;

    success(ctx, recipeData);
};

/**
 * @swagger
 * /api/recipes/recommend:
 *   get:
 *     summary: 获取推荐菜谱
 *     tags: [Recipe]
 *     description: 根据用户体质和偏好获取个性化推荐菜谱
 *     parameters:
 *       - in: header
 *         name: X-Session-Id
 *         required: true
 *         schema:
 *           type: string
 *         description: 会话ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 6
 *         description: 返回数量
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                     reason:
 *                       type: string
 */
export const getRecommendedRecipes = async (ctx) => {
    const sessionId = ctx.get('X-Session-Id');
    const { limit = 6 } = ctx.query;

    // 获取所有活跃菜谱
    const recipes = await Recipe.find({ isActive: true }).select('-__v');

    // 获取用户信息
    let userProfile = null;
    let recommendReason = '为您推荐的健康食谱';

    if (sessionId) {
        const user = await User.findOne({ sessionId });
        if (user) {
            const preferences = await UserPreference.findOne({ userId: user._id });
            userProfile = {
                constitution: user.constitution,
                preferences: preferences ? preferences.toObject() : null
            };

            // 生成推荐理由
            if (user.constitution && user.constitution.type) {
                const constitutionNames = {
                    balanced: '平和质',
                    qi_deficiency: '气虚质',
                    yang_deficiency: '阳虚质',
                    yin_deficiency: '阴虚质',
                    phlegm_dampness: '痰湿质',
                    damp_heat: '湿热质',
                    blood_stasis: '血瘀质',
                    qi_stagnation: '气郁质',
                    special: '特禀质'
                };
                const constitutionName = constitutionNames[user.constitution.type] || '您的体质';
                recommendReason = `根据您的${constitutionName}，为您精选的食养方案`;
            }
        }
    }

    // 计算匹配度并排序
    const rankedRecipes = rankRecipes(recipes, userProfile);

    // 取前N个
    const topRecipes = rankedRecipes.slice(0, parseInt(limit));

    success(ctx, {
        list: topRecipes,
        reason: recommendReason
    });
};

/**
 * @swagger
 * /api/recipes/categories:
 *   get:
 *     summary: 获取菜谱分类统计
 *     tags: [Recipe]
 *     description: 获取各分类的菜谱数量
 *     responses:
 *       200:
 *         description: 获取成功
 */
export const getRecipeCategories = async (ctx) => {
    const warming = await Recipe.countDocuments({
        isActive: true,
        nature: { $in: ['温', '热'] }
    });

    const cooling = await Recipe.countDocuments({
        isActive: true,
        nature: { $in: ['凉', '寒'] }
    });

    const quick = await Recipe.countDocuments({
        isActive: true,
        cookingTime: { $lte: 30 }
    });

    const total = await Recipe.countDocuments({ isActive: true });

    success(ctx, {
        categories: [
            { key: 'recommended', name: '为你推荐', count: total },
            { key: 'warming', name: '温补', count: warming },
            { key: 'cooling', name: '清润', count: cooling },
            { key: 'quick', name: '快手菜', count: quick }
        ]
    });
};

/**
 * @swagger
 * /api/recipes:
 *   post:
 *     summary: 创建新菜谱
 *     tags: [Recipe]
 *     description: 创建一个新的菜谱（仅管理员）
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 菜谱名称
 *               description:
 *                 type: string
 *                 description: 菜谱描述
 *               image:
 *                 type: string
 *                 description: 菜谱图片URL
 *                 default: ""
 *               emoji:
 *                 type: string
 *                 description: emoji图标
 *                 default: 🍲
 *               nature:
 *                 type: string
 *                 enum: [寒, 凉, 平, 温, 热]
 *                 description: 性味
 *               flavors:
 *                 type: array
 *                 description: 味道列表（如：酸、甘、苦、辛、咸、淡等）
 *                 items:
 *                   type: string
 *                 default: []
 *               meridians:
 *                 type: array
 *                 description: 归经列表（如：肺经、脾经、心经等）
 *                 items:
 *                   type: string
 *                 default: []
 *               suitableConstitutions:
 *                 type: array
 *                 description: 适合的体质列表
 *                 items:
 *                   type: string
 *                   enum: [balanced, qi_deficiency, yang_deficiency, yin_deficiency, phlegm_dampness, damp_heat, blood_stasis, qi_stagnation, special]
 *                 default: []
 *               avoidConstitutions:
 *                 type: array
 *                 description: 不适合的体质列表
 *                 items:
 *                   type: string
 *                   enum: [balanced, qi_deficiency, yang_deficiency, yin_deficiency, phlegm_dampness, damp_heat, blood_stasis, qi_stagnation, special]
 *                 default: []
 *               category:
 *                 type: string
 *                 description: 菜谱分类
 *                 enum: [warming, cooling, neutral, quick]
 *                 default: neutral
 *               tags:
 *                 type: array
 *                 description: 标签列表
 *                 items:
 *                   type: string
 *                 default: []
 *               ingredients:
 *                 type: array
 *                 description: 食材列表
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: 食材名称
 *                     amount:
 *                       type: string
 *                       description: 食材用量
 *                     icon:
 *                       type: string
 *                       description: 食材图标
 *                       default: 🥬
 *               steps:
 *                 type: array
 *                 description: 烹饪步骤
 *                 items:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: integer
 *                       description: 步骤顺序
 *                     content:
 *                       type: string
 *                       description: 步骤内容
 *               cookingTime:
 *                 type: integer
 *                 description: 烹饪时间（分钟）
 *                 default: 30
 *                 minimum: 0
 *               difficulty:
 *                 type: string
 *                 description: 烹饪难度
 *                 enum: [简单, 中等, 困难]
 *                 default: 简单
 *               analysis:
 *                 type: string
 *                 description: 中医食养分析说明
 *                 default: ""
 *               baseScore:
 *                 type: integer
 *                 description: 基础评分（0-100）
 *                 default: 80
 *                 minimum: 0
 *                 maximum: 100
 *               isActive:
 *                 type: boolean
 *                 description: 是否启用
 *                 default: true
 *               sortOrder:
 *                 type: integer
 *                 description: 排序顺序
 *                 default: 0
 *     responses:
 *       200:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: 创建的菜谱对象
 *       400:
 *         description: 参数错误或验证失败
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足（仅管理员可用）
 */
export const createRecipe = async (ctx) => {
    try {
        const recipeData = ctx.request.body;

        // 创建新菜谱
        const recipe = new Recipe(recipeData);
        await recipe.save();

        success(ctx, recipe.toObject(), '菜谱创建成功');
    } catch (err) {
        console.error('创建菜谱失败:', err);
        return error(ctx, err.message || '菜谱创建失败', 400, 400);
    }
};

/**
 * @swagger
 * /api/recipes/{id}:
 *   put:
 *     summary: 更新菜谱
 *     tags: [Recipe]
 *     description: 更新指定ID的菜谱信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 菜谱ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 菜谱不存在
 *       400:
 *         description: 参数错误
 */
export const updateRecipe = async (ctx) => {
    try {
        const { id } = ctx.params;
        const recipeData = ctx.request.body;

        // 查找并更新菜谱
        const recipe = await Recipe.findByIdAndUpdate(
            id,
            recipeData,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!recipe) {
            return error(ctx, '菜谱不存在', 404, 404);
        }

        success(ctx, recipe.toObject(), '菜谱更新成功');
    } catch (err) {
        console.error('更新菜谱失败:', err);
        return error(ctx, err.message || '菜谱更新失败', 400, 400);
    }
};

/**
 * @swagger
 * /api/recipes/{id}:
 *   delete:
 *     summary: 删除菜谱
 *     tags: [Recipe]
 *     description: 硬删除指定ID的菜谱
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 菜谱ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 菜谱不存在
 */
export const deleteRecipe = async (ctx) => {
    try {
        const { id } = ctx.params;

        // 硬删除菜谱
        const recipe = await Recipe.findByIdAndDelete(id);

        if (!recipe) {
            return error(ctx, '菜谱不存在', 404, 404);
        }

        success(ctx, null, '菜谱删除成功');
    } catch (err) {
        console.error('删除菜谱失败:', err);
        return error(ctx, err.message || '菜谱删除失败', 400, 400);
    }
};

/**
 * @swagger
 * /api/recipes/generate:
 *   post:
 *     summary: AI生成菜谱
 *     tags: [Recipe]
 *     description: 根据菜品描述、目标体质和特殊要求使用AI生成个性化菜谱数据
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dishDescription
 *             properties:
 *               dishDescription:
 *                 type: string
 *                 description: 菜品描述，详细说明想要制作的菜品特点、功效等
 *                 example: "我想做一道清淡的汤，希望有养胃的功效，适合晚餐食用"
 *               targetConstitution:
 *                 type: string
 *                 enum: [balanced, qi_deficiency, yang_deficiency, yin_deficiency, phlegm_dampness, damp_heat, blood_stasis, qi_stagnation, special]
 *                 description: 目标体质类型，用于个性化调理
 *                 example: "qi_deficiency"
 *               specialRequirements:
 *                 type: string
 *                 description: 特殊要求，如过敏原、饮食禁忌、口味偏好等
 *                 example: "不要放葱，少吃盐，希望口感偏甜，烹饪时间控制在30分钟内"
 *     responses:
 *       200:
 *         description: 生成成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: object
 *                   description: 生成的菜谱数据
 *       400:
 *         description: 参数错误或生成失败
 *       500:
 *         description: 服务器错误
 */
export const generateRecipeByAI = async (ctx) => {
    try {
        const { dishDescription, targetConstitution, specialRequirements, count = 1 } = ctx.request.body;

        // 验证必填参数
        if (!dishDescription || typeof dishDescription !== 'string' || dishDescription.trim().length === 0) {
            return error(ctx, '请提供有效的菜品描述', 400, 400);
        }

        // 验证 count 参数
        const recipeCount = parseInt(count);
        if (isNaN(recipeCount) || recipeCount < 1 || recipeCount > 10) {
            return error(ctx, '生成数量必须在 1-10 之间', 400, 400);
        }

        // 验证目标体质参数（如果提供）
        const validConstitutions = ['balanced', 'qi_deficiency', 'yang_deficiency', 'yin_deficiency', 'phlegm_dampness', 'damp_heat', 'blood_stasis', 'qi_stagnation', 'special'];
        if (targetConstitution && !validConstitutions.includes(targetConstitution)) {
            return error(ctx, '目标体质参数无效，请使用有效的体质类型', 400, 400);
        }

        // 定义差异化策略
        const styleVariations = [
            '清淡风格，口感鲜美',
            '浓郁风格，味道香醇',
            '爽口风格，清爽开胃',
            '香醇风格，回味悠长',
            '鲜美风格，营养丰富',
            '酥脆风格，口感独特',
            '软糯风格，易于消化',
            '酸甜风格，开胃解腻',
            '麻辣风格，刺激味蕾',
            '咸鲜风格，经典美味'
        ];

        const cookingMethods = ['炒菜做法', '炖汤做法', '蒸菜做法', '煮粥做法', '凉拌做法', '煎制做法', '烤制做法', '焖煮做法'];

        // 有限并发控制：每批3个请求
        const batchSize = 3;
        const allRecipes = [];
        const errors = [];

        for (let i = 0; i < recipeCount; i += batchSize) {
            const batchPromises = [];
            const batchEnd = Math.min(i + batchSize, recipeCount);

            for (let j = i; j < batchEnd; j++) {
                // 构建差异化提示词
                let enhancedDescription = dishDescription.trim();

                // 添加序号和差异化要求
                enhancedDescription += `。这是第 ${j + 1}/${recipeCount} 个菜谱`;

                // 添加风格差异
                const styleIndex = j % styleVariations.length;
                enhancedDescription += `，${styleVariations[styleIndex]}`;

                // 添加烹饪方法差异（如果数量足够多）
                if (recipeCount > 3) {
                    const methodIndex = j % cookingMethods.length;
                    enhancedDescription += `，采用${cookingMethods[methodIndex]}`;
                }

                // 明确要求差异性
                if (recipeCount > 1) {
                    enhancedDescription += `。请确保菜谱名称和主要食材与其他菜谱有明显差异，避免重复`;
                }

                // 设置随机种子和温度
                const options = {
                    temperature: 0.85,
                    seed: Date.now() + j
                };

                batchPromises.push(
                    generateRecipeJSON(
                        enhancedDescription,
                        targetConstitution,
                        specialRequirements,
                        options
                    )
                        .then(recipe => ({ success: true, recipe, index: j }))
                        .catch(err => ({ success: false, error: err.message, index: j }))
                );
            }

            // 等待当前批次完成
            const batchResults = await Promise.all(batchPromises);

            // 处理结果
            for (const result of batchResults) {
                if (result.success) {
                    allRecipes.push(result.recipe);
                } else {
                    errors.push(`第 ${result.index + 1} 个菜谱生成失败: ${result.error}`);
                }
            }
        }

        // 去重检查：根据菜谱名称去重
        const uniqueRecipes = [];
        const seenNames = new Set();

        for (const recipe of allRecipes) {
            const recipeName = recipe.name.trim();
            if (!seenNames.has(recipeName)) {
                seenNames.add(recipeName);
                uniqueRecipes.push(recipe);
            } else {
                console.warn(`发现重复菜谱: ${recipeName}，已自动去重`);
            }
        }

        // 如果没有成功生成任何菜谱
        if (uniqueRecipes.length === 0) {
            return error(ctx, `菜谱生成失败: ${errors.join('; ')}`, 500, 500);
        }

        // 为每个菜谱添加AI生成标识
        const recipesWithMetadata = uniqueRecipes.map((recipe, index) => ({
            ...recipe,
            generatedBy: 'AI',
            generatedAt: new Date(),
            inputParams: {
                dishDescription: dishDescription.trim(),
                targetConstitution: targetConstitution || null,
                specialRequirements: specialRequirements || null,
                requestedCount: recipeCount,
                generatedIndex: index + 1
            }
        }));

        // 构建响应消息
        let message = `成功生成 ${uniqueRecipes.length} 个菜谱`;
        if (errors.length > 0) {
            message += `，其中 ${errors.length} 个失败`;
        }
        if (allRecipes.length > uniqueRecipes.length) {
            message += `，已自动去除 ${allRecipes.length - uniqueRecipes.length} 个重复菜谱`;
        }

        success(ctx, recipesWithMetadata, message);
    } catch (err) {
        console.error('AI生成菜谱失败:', err);
        return error(ctx, err.message || 'AI生成菜谱失败，请稍后重试', 500, 500);
    }
};

/**
 * @swagger
 * /api/recipes/save-generated:
 *   post:
 *     summary: 保存AI生成的菜谱
 *     tags: [Recipe]
 *     description: 保存经过人工编辑的AI生成菜谱到数据库
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - nature
 *               - ingredients
 *               - steps
 *             properties:
 *               name:
 *                 type: string
 *                 description: 菜谱名称
 *               description:
 *                 type: string
 *                 description: 菜谱描述
 *               nature:
 *                 type: string
 *                 enum: [寒, 凉, 平, 温, 热]
 *                 description: 性味
 *               ingredients:
 *                 type: array
 *                 description: 食材列表
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: 食材名称
 *                     amount:
 *                       type: string
 *                       description: 食材用量
 *                     nature:
 *                       type: string
 *                       description: 食材性味
 *               steps:
 *                 type: array
 *                 description: 烹饪步骤
 *                 items:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: integer
 *                       description: 步骤顺序
 *                     description:
 *                       type: string
 *                       description: 步骤描述
 *               emoji:
 *                 type: string
 *                 description: emoji图标
 *                 default: 🍲
 *               flavors:
 *                 type: array
 *                 description: 味道列表
 *                 items:
 *                   type: string
 *                 default: []
 *               meridians:
 *                 type: array
 *                 description: 归经列表
 *                 items:
 *                   type: string
 *                 default: []
 *               suitableConstitutions:
 *                 type: array
 *                 description: 适合的体质列表
 *                 items:
 *                   type: string
 *                 default: []
 *               avoidConstitutions:
 *                 type: array
 *                 description: 不适合的体质列表
 *                 items:
 *                   type: string
 *                 default: []
 *               category:
 *                 type: string
 *                 description: 菜谱分类
 *                 default: neutral
 *               tags:
 *                 type: array
 *                 description: 标签列表
 *                 items:
 *                   type: string
 *                 default: []
 *               cookingTime:
 *                 type: integer
 *                 description: 烹饪时间（分钟）
 *                 default: 30
 *               difficulty:
 *                 type: string
 *                 description: 烹饪难度
 *                 enum: [简单, 中等, 困难]
 *                 default: 简单
 *               analysis:
 *                 type: string
 *                 description: 中医分析说明
 *                 default: ""
 *               baseScore:
 *                 type: integer
 *                 description: 基础评分（0-100）
 *                 default: 80
 *               isActive:
 *                 type: boolean
 *                 description: 是否启用
 *                 default: true
 *               sortOrder:
 *                 type: integer
 *                 description: 排序顺序
 *                 default: 0
 *     responses:
 *       200:
 *         description: 保存成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   description: 保存的菜谱对象
 *       400:
 *         description: 参数错误或验证失败
 *       500:
 *         description: 服务器错误
 */
export const saveAIGeneratedRecipe = async (ctx) => {
    try {
        const recipeData = ctx.request.body;


        // 设置默认值
        recipeData.emoji = recipeData.emoji || '🍲';
        recipeData.flavors = recipeData.flavors || [];
        recipeData.meridians = recipeData.meridians || [];
        recipeData.suitableConstitutions = recipeData.suitableConstitutions || [];
        recipeData.avoidConstitutions = recipeData.avoidConstitutions || [];
        recipeData.category = recipeData.category || 'neutral';
        recipeData.tags = recipeData.tags || [];
        recipeData.cookingTime = recipeData.cookingTime || 30;
        recipeData.difficulty = recipeData.difficulty || '简单';
        recipeData.analysis = recipeData.analysis || '';
        recipeData.baseScore = recipeData.baseScore || 80;
        recipeData.isActive = recipeData.isActive !== false;
        recipeData.sortOrder = recipeData.sortOrder || 0;

        // 创建新菜谱
        const recipe = new Recipe(recipeData);
        await recipe.save();

        success(ctx, recipe.toObject(), 'AI生成菜谱保存成功');
    } catch (err) {
        console.error('保存AI生成菜谱失败:', err);

        // 处理MongoDB重复键错误
        if (err.code === 11000) {
            return error(ctx, '已存在同名菜谱，请修改菜谱名称', 400, 400);
        }

        return error(ctx, err.message || '保存菜谱失败', 500, 500);
    }
};

/**
 * @swagger
 * /api/recipes/ai-recommend:
 *   post:
 *     summary: AI智能推荐菜品
 *     tags: [Recipe]
 *     description: 基于用户偏好进行AI深度分析，生成个性化菜品推荐
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
 *               mealType:
 *                 type: string
 *                 enum: [breakfast, lunch, dinner, snack]
 *                 description: 用餐类型（可选）
 *                 example: "dinner"
 *               count:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 20
 *                 default: 6
 *                 description: 推荐数量
 *                 example: 6
 *               excludeIngredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: 额外排除的食材（可选）
 *                 example: ["香菜", "胡萝卜"]
 *               specialRequirements:
 *                 type: string
 *                 description: 特殊要求（可选）
 *                 example: "希望菜品清淡易消化，适合晚餐食用"
 *     responses:
 *       200:
 *         description: 推荐成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 data:
 *                   type: object
 *                   properties:
 *                     list:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           matchScore:
 *                             type: integer
 *                           matchReason:
 *                             type: string
 *                           aiRecommendation:
 *                             type: object
 *                             properties:
 *                               reason:
 *                                 type: string
 *                               nutritionTags:
 *                                 type: array
 *                                 items:
 *                                   type: string
 *                               bestMealTime:
 *                                 type: string
 *                               seasonalAdvice:
 *                                 type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         pageSize:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                     aiAnalysis:
 *                       type: object
 *                       properties:
 *                         userProfile:
 *                           type: string
 *                         recommendStrategy:
 *                           type: string
 *                         nutritionBalance:
 *                           type: string
 *       400:
 *         description: 参数错误
 *       404:
 *         description: 用户不存在或偏好数据不存在
 *       500:
 *         description: 服务器错误
 */
export const getAIRecommendations = async (ctx) => {
    try {
        const sessionId = ctx.get('X-Session-Id');
        const { mealType, count = 6, excludeIngredients = [], specialRequirements } = ctx.request.body;

        // 验证会话ID
        if (!sessionId) {
            return error(ctx, '缺少会话ID', 400, 400);
        }

        // 验证推荐数量
        const recommendCount = Math.min(Math.max(parseInt(count) || 6, 1), 20);

        // 获取用户信息
        const user = await User.findOne({ sessionId });
        if (!user) {
            return error(ctx, '用户不存在', 404, 404);
        }

        // 获取用户偏好
        const userPreference = await UserPreference.findOne({ userId: user._id });
        if (!userPreference) {
            return error(ctx, '用户偏好数据不存在，请先设置偏好', 404, 404);
        }

        // 直接调用AI生成菜品推荐
        const aiRecommendationResult = await generateAIRecipeRecommendations(
            userPreference.toObject(),
            user.constitution?.type,
            mealType,
            recommendCount,
            excludeIngredients,
            specialRequirements
        );

        // 构建返回数据，保持与 /api/recipes 接口的一致性
        const responseData = {
            list: aiRecommendationResult.recommendations,
            pagination: {
                page: 1,
                pageSize: recommendCount,
                total: aiRecommendationResult.recommendations.length
            },
            aiAnalysis: {
                userProfile: aiRecommendationResult.userProfile,
                recommendStrategy: aiRecommendationResult.recommendStrategy,
                nutritionBalance: aiRecommendationResult.nutritionBalance
            }
        };

        success(ctx, responseData, 'AI智能推荐成功');

    } catch (err) {
        console.error('AI智能推荐失败:', err);
        return error(ctx, err.message || 'AI智能推荐失败，请稍后重试', 500, 500);
    }
};

export default {
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
};

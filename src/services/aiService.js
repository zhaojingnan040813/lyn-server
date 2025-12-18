import OpenAI from 'openai';
import config from '../config/index.js';

// 初始化 DeepSeek 客户端
const client = new OpenAI({
    apiKey: config.deepseek.apiKey,
    baseURL: config.deepseek.baseUrl
});

// 系统提示词 - 定义 AI 的角色和行为
const SYSTEM_PROMPT = `你是一位专业的中医体质健康顾问，名叫"养生小助手"。

## 项目背景
本系统是齐齐哈尔医学院2026届学生的毕业设计项目——"基于中医体质辨识的个性化膳食推荐系统"。该项目旨在将传统中医体质理论与现代智能技术相结合，为用户提供科学、个性化的健康饮食指导。

## 你的职责

1. **体质辨识与分析**
   - 根据用户描述的身体症状、生活习惯、情绪状态等信息，分析其可能的中医体质类型
   - 综合判断用户是否存在兼夹体质（多种体质特征并存）
   - 解释体质形成的原因及其对健康的影响

2. **健康养生建议**
   - 提供针对性的饮食调理建议，包括宜食和忌食的食物
   - 给出起居作息、运动锻炼、情志调节等方面的养生指导
   - 根据季节变化提供应季养生建议

3. **个性化膳食推荐**
   - 根据体质特点推荐适宜的食材、药膳和日常菜谱
   - 提供简单易行的食疗方案
   - 结合用户的口味偏好和地域特点给出建议

4. **健康知识科普**
   - 普及中医体质养生知识
   - 解答用户关于中医食疗、体质调理的疑问
   - 纠正常见的养生误区

## 九种中医体质类型详解

| 体质类型 | 主要特征 | 形成原因 | 调理原则 |
|---------|---------|---------|---------|
| 平和质 | 阴阳气血调和，体态适中，面色红润，精力充沛 | 先天禀赋良好，后天调养得当 | 维持平衡，预防偏颇 |
| 气虚质 | 元气不足，疲乏无力，气短懒言，易出汗 | 先天不足、过度劳累、久病耗气 | 补气养气，健脾益肺 |
| 阳虚质 | 阳气不足，畏寒怕冷，手足不温，喜热饮食 | 先天阳气不足、过食寒凉、久病伤阳 | 温补阳气，散寒保暖 |
| 阴虚质 | 阴液亏少，口燥咽干，手足心热，潮热盗汗 | 先天不足、燥热之品过多、情志内伤 | 滋阴清热，养阴润燥 |
| 痰湿质 | 痰湿凝聚，形体肥胖，腹部肥满，皮肤油腻 | 饮食不节、缺乏运动、脾虚运化失常 | 健脾化湿，祛痰降浊 |
| 湿热质 | 湿热内蕴，面垢油腻，口苦口干，大便黏滞 | 嗜食辛辣油腻、居住环境潮湿 | 清热利湿，分消走泄 |
| 血瘀质 | 血行不畅，肤色晦暗，易生色斑，唇色紫暗 | 情志不畅、久病入络、外伤跌打 | 活血化瘀，通络散结 |
| 气郁质 | 气机郁滞，情绪低落，胸胁胀满，善太息 | 情志不遂、压力过大、性格内向 | 疏肝理气，调畅情志 |
| 特禀质 | 先天特殊，过敏体质，易患过敏性疾病 | 先天禀赋异常、遗传因素 | 益气固表，脱敏止敏 |

## 回答规范

### 语言风格
- 使用通俗易懂的语言，避免过多专业术语
- 语气亲切友好，体现关怀
- 回答简洁明了，重点突出
- 适当使用emoji表情增加亲和力 😊

### 交互原则
- 必要时主动追问用户以获取更多信息
- 针对用户的具体情况给出个性化建议
- 提供的建议要具体、可操作
- 循序渐进地引导用户了解自己的体质

### 安全提示
- 涉及严重健康问题时，建议用户及时就医
- 对于孕妇、儿童、老年人等特殊人群，给出特别提醒
- 不推荐可能有副作用的偏方或未经验证的疗法

## 重要声明

⚠️ 本系统仅供健康参考和养生指导，不能替代专业医疗诊断。
- 你只是健康顾问，不能进行医学诊断或开具处方
- 所有建议仅供参考，具体情况请咨询专业医师
- 本系统是学术研究性质的毕业设计项目`;

/**
 * 发送消息到 AI 并获取回复
 * @param {Array} messages - 对话历史 [{role: 'user'|'assistant', content: '...'}]
 * @returns {Promise<string>} AI 回复内容
 */
export const chat = async (messages) => {
    try {
        const response = await client.chat.completions.create({
            model: config.deepseek.model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            max_tokens: config.deepseek.maxTokens,
            temperature: config.deepseek.temperature,
            stream: false
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('AI Service Error:', error);
        throw new Error('AI 服务暂时不可用，请稍后再试');
    }
};

/**
 * 流式对话（支持打字机效果）
 * @param {Array} messages - 对话历史
 * @returns {AsyncGenerator} 流式响应生成器
 */
export const chatStream = async function* (messages) {
    try {
        const stream = await client.chat.completions.create({
            model: config.deepseek.model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...messages
            ],
            max_tokens: config.deepseek.maxTokens,
            temperature: config.deepseek.temperature,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    } catch (error) {
        console.error('AI Stream Error:', error);
        throw new Error('AI 服务暂时不可用，请稍后再试');
    }
};

// 菜谱生成专用系统提示词
const RECIPE_GENERATION_PROMPT = `你是一位专业的中医膳食营养师和烹饪专家。请根据用户提供的菜品描述、目标体质和特殊要求，生成一个完整的个性化中医菜谱。请返回JSON格式数据。

专业要求：
1. 中医理论必须准确，性味归经要符合中医理论
2. 食材用量要合理，烹饪步骤要清晰可操作
3. 菜谱名称要体现菜品特色，描述要详细
4. 必须严格遵循用户的特殊要求（过敏原、饮食禁忌、口味偏好等）
5. 根据目标体质调整食材选择和烹饪方法，体现个性化调理

体质类型说明：
- balanced: 平和质 - 阴阳气血调和，适合日常养生
- qi_deficiency: 气虚质 - 元气不足，需要补气养气
- yang_deficiency: 阳虚质 - 阳气不足，需要温补阳气
- yin_deficiency: 阴虚质 - 阴液亏少，需要滋阴清热
- phlegm_dampness: 痰湿质 - 痰湿凝聚，需要健脾化湿
- damp_heat: 湿热质 - 湿热内蕴，需要清热利湿
- blood_stasis: 血瘀质 - 血行不畅，需要活血化瘀
- qi_stagnation: 气郁质 - 气机郁滞，需要疏肝理气
- special: 特禀质 - 先天特殊，需要益气固表

请生成包含以下字段的JSON格式菜谱数据：
- name: 菜谱名称
- description: 详细描述，包含功效、特点和针对目标体质的调理作用
- emoji: 相关emoji图标
- nature: 寒|凉|平|温|热
- flavors: 酸、甘、苦、辛、咸数组
- meridians: 归经数组
- suitableConstitutions: 适合的体质类型数组
- avoidConstitutions: 禁忌的体质类型数组
- category: warming|cooling|neutral|quick
- tags: 标签数组
- ingredients: 食材数组，包含name、amount、icon字段
- steps: 步骤数组，包含order、content字段
- cookingTime: 烹饪时间（分钟）
- difficulty: 简单|中等|困难
- analysis: 食养分析，包含中医理论解释、针对目标体质的调理机理，以及如何满足特殊要求的说明

请根据用户提供的信息生成完整的个性化JSON格式菜谱数据：`;

/**
 * 生成菜谱JSON数据
 * @param {string} dishDescription - 菜品描述
 * @param {string} targetConstitution - 目标体质（可选）
 * @param {string} specialRequirements - 特殊要求（可选）
 * @param {Object} options - 可选配置 { temperature, seed }
 * @returns {Promise<Object>} 菜谱JSON数据
 */
export const generateRecipeJSON = async (dishDescription, targetConstitution = null, specialRequirements = null, options = {}) => {
    try {
        // 构建详细的用户提示
        let userPrompt = `请根据以下信息生成一个完整的个性化中医菜谱：\n\n`;
        userPrompt += `菜品描述：${dishDescription}\n`;

        if (targetConstitution) {
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
            const constitutionName = constitutionNames[targetConstitution] || targetConstitution;
            userPrompt += `目标体质：${constitutionName}（${targetConstitution}）\n`;
        }

        if (specialRequirements) {
            userPrompt += `特殊要求：${specialRequirements}\n`;
        }

        userPrompt += `\n请生成符合要求的菜谱数据，特别注意：`;
        userPrompt += `\n1. 菜谱要符合菜品描述的特点`;
        if (targetConstitution) {
            userPrompt += `\n2. 食材和烹饪方法要适合目标体质的调理需求`;
            userPrompt += `\n3. suitableConstitutions数组必须包含目标体质`;
        }
        if (specialRequirements) {
            userPrompt += `\n4. 必须严格遵守特殊要求（如过敏原、饮食禁忌、口味偏好等）`;
        }

        const useJsonOutput = config.deepseek.enableJsonOutput;
        const model = useJsonOutput ? config.deepseek.jsonOutputModel : config.deepseek.model;

        // 从 options 中获取 temperature 和 seed，使用默认值
        const temperature = options.temperature || 0.7;
        const seed = options.seed;

        const requestParams = {
            model: model,
            messages: [
                { role: 'system', content: RECIPE_GENERATION_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: config.deepseek.maxTokens,
            temperature: temperature,
            stream: false,
            ...(useJsonOutput && { response_format: { type: "json_object" } })
        };

        // 如果提供了 seed，添加到请求参数中
        if (seed !== undefined) {
            requestParams.seed = seed;
        }

        const response = await client.chat.completions.create(requestParams);

        const content = response.choices[0].message.content.trim();

        // 使用 JSON Output 时直接解析，否则使用传统方式
        let recipeData;
        if (useJsonOutput) {
            recipeData = JSON.parse(content);
        } else {
            // 传统方式：移除可能的前后缀标记
            const jsonContent = content.replace(/```json\s*|\s*```/g, '');
            recipeData = JSON.parse(jsonContent);
        }

        // 验证必填字段
        const requiredFields = ['name', 'description', 'nature', 'ingredients', 'steps'];
        const missingFields = requiredFields.filter(field => !recipeData[field]);

        if (missingFields.length > 0) {
            throw new Error(`生成的菜谱缺少必填字段: ${missingFields.join(', ')}`);
        }

        // 验证字段值的有效性
        if (!['寒', '凉', '平', '温', '热'].includes(recipeData.nature)) {
            throw new Error(`性味字段值无效: ${recipeData.nature}`);
        }

        // 如果指定了目标体质，验证是否适合
        if (targetConstitution) {
            if (!recipeData.suitableConstitutions || !recipeData.suitableConstitutions.includes(targetConstitution)) {
                console.warn(`目标体质未包含在适合体质中:`, {
                    target: targetConstitution,
                    suitable: recipeData.suitableConstitutions
                });
            }
        }

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
        recipeData.baseScore = 80;
        recipeData.isActive = true;
        recipeData.sortOrder = 0;

        return recipeData;

    } catch (error) {
        console.error('生成菜谱失败:', error);
        throw error;
    }
};

/**
 * 验证菜谱JSON数据结构
 * @param {Object} recipe - 菜谱数据
 * @returns {boolean} 验证结果
 */
export const validateRecipeJSON = (recipe) => {
    if (!recipe || typeof recipe !== 'object') {
        return false;
    }

    const requiredFields = ['name', 'description', 'nature', 'ingredients', 'steps'];
    const missingFields = requiredFields.filter(field => !recipe[field]);

    if (missingFields.length > 0) {
        return false;
    }

    // 验证性味
    if (!['寒', '凉', '平', '温', '热'].includes(recipe.nature)) {
        return false;
    }

    // 验证食材数组
    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        return false;
    }

    // 验证步骤数组
    if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
        return false;
    }

    return true;
};

// AI菜品推荐专用系统提示词
const AI_RECIPE_RECOMMENDATION_PROMPT = `你是一位专业的中医体质健康顾问和营养专家，擅长基于用户偏好数据生成个性化的菜品推荐。请返回JSON格式数据。

## 你的任务
根据用户的具体偏好数据，深度分析用户特征，并生成5-8个全新的个性化菜品推荐。

## 用户偏好数据结构说明
- flavorPreference: 五味偏好（酸、甜、苦、辣、咸，0-100分）
- dietaryRestrictions: 饮食禁忌（如素食、纯素、无麸质等）
- allergies: 过敏原列表
- dislikedIngredients: 不喜欢的食材
- currentConditions: 当前身体状态（如失眠、口干舌燥等）
- mealScenarios: 用餐场景偏好（如宵夜、约会等）
- cookingDifficulty: 烹饪难度偏好（1-5级）
- maxCookingTime: 最大烹饪时间（分钟）

## 体质类型说明
- balanced: 平和质 - 阴阳气血调和
- qi_deficiency: 气虚质 - 元气不足，易疲乏
- yang_deficiency: 阳虚质 - 阳气不足，畏寒怕冷
- yin_deficiency: 阴虚质 - 阴液亏少，口燥咽干
- phlegm_dampness: 痰湿质 - 痰湿凝聚，形体肥胖
- damp_heat: 湿热质 - 湿热内蕴，面垢油腻
- blood_stasis: 血瘀质 - 血行不畅，肤色晦暗
- qi_stagnation: 气郁质 - 气机郁滞，情绪低落
- special: 特禀质 - 先天特殊，过敏体质

## 输出要求
1. 推荐的菜品要完全基于用户偏好，体现个性化特色
2. 每个菜品都要包含完整的制作信息
3. 推荐理由要具体、个性化，体现对用户偏好的深度理解
4. 严格遵守用户的饮食禁忌、过敏原和不喜欢食材的限制

请生成包含以下结构化数据：
- userProfile: 用户画像分析，包含体质特点、口味偏好、生活习惯等综合描述
- recommendStrategy: 推荐策略说明，解释为什么选择这些菜品推荐
- nutritionBalance: 营养均衡建议，提供饮食搭配和调理建议
- recommendations: 推荐菜品数组，每个菜品包含：
  - name: 菜品名称
  - description: 详细描述，包含功效、特点和调理作用
  - emoji: 相关emoji图标
  - nature: 寒|凉|平|温|热
  - flavors: 酸、甘、苦、辛、咸数组
  - meridians: 归经数组
  - suitableConstitutions: 适合的体质类型数组
  - avoidConstitutions: 禁忌的体质类型数组
  - tags: 标签数组
  - ingredients: 食材数组，包含name、amount、icon字段
  - steps: 步骤数组，包含order、content字段
  - cookingTime: 烹饪时间（分钟）
  - difficulty: 简单|中等|困难
  - nutritionTags: 营养标签数组
  - bestMealTime: 最佳用餐时间
  - seasonalAdvice: 季节性建议
  - recommendReason: 个性化推荐理由（50-100字）
  - healthBenefits: 健康益处说明

请根据提供的用户数据进行深度分析并生成个性化菜品推荐：`;

// AI推荐分析专用系统提示词
const AI_RECOMMENDATION_PROMPT = `你是一位专业的中医体质健康顾问和营养专家，擅长基于用户偏好数据提供个性化的菜品推荐分析。

## 你的任务
根据用户的具体偏好数据，深度分析用户特征，并为推荐的菜品生成个性化的推荐理由和分析说明。

## 用户偏好数据结构
- flavorPreference: 五味偏好（酸、甜、苦、辣、咸，0-100分）
- dietaryRestrictions: 饮食禁忌（如素食、纯素、无麸质等）
- allergies: 过敏原列表
- dislikedIngredients: 不喜欢的食材
- currentConditions: 当前身体状态（如失眠、口干舌燥等）
- mealScenarios: 用餐场景偏好（如宵夜、约会等）
- cookingDifficulty: 烹饪难度偏好（1-5级）
- maxCookingTime: 最大烹饪时间（分钟）

## 体质类型对应
- balanced: 平和质 - 阴阳气血调和
- qi_deficiency: 气虚质 - 元气不足，易疲乏
- yang_deficiency: 阳虚质 - 阳气不足，畏寒怕冷
- yin_deficiency: 阴虚质 - 阴液亏少，口燥咽干
- phlegm_dampness: 痰湿质 - 痰湿凝聚，形体肥胖
- damp_heat: 湿热质 - 湿热内蕴，面垢油腻
- blood_stasis: 血瘀质 - 血行不畅，肤色晦暗
- qi_stagnation: 气郁质 - 气机郁滞，情绪低落
- special: 特禀质 - 先天特殊，过敏体质

## 输出要求
1. 严格按照用户画像、推荐策略、营养建议三个方面进行分析
2. 推荐理由要具体、个性化，体现对用户偏好的深度理解
3. 营养标签要准确反映菜品的营养特点
4. 用餐时间建议要符合用户的实际情况

请生成包含以下结构化数据：
- userProfile: 用户画像分析，包含体质特点、口味偏好、生活习惯等综合描述
- recommendStrategy: 推荐策略说明，解释为什么选择这些菜品推荐
- nutritionBalance: 营养均衡建议，提供饮食搭配和调理建议

请根据提供的用户数据进行深度分析：`;

/**
 * 分析用户偏好并生成推荐建议
 * @param {Object} userPreference - 用户偏好数据
 * @param {string} userConstitution - 用户体质类型
 * @param {string} mealType - 用餐类型（可选）
 * @returns {Promise<Object>} AI分析结果
 */
export const analyzeUserPreferenceForRecommendation = async (userPreference, userConstitution = null, mealType = null) => {
    try {
        // 构建用户数据描述
        let userDescription = `用户偏好数据分析：\n\n`;

        // 体质信息
        if (userConstitution) {
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
            userDescription += `体质类型：${constitutionNames[userConstitution]}（${userConstitution}）\n`;
        }

        // 五味偏好
        if (userPreference.flavorPreference) {
            userDescription += `\n五味偏好：\n`;
            const flavorNames = {
                sour: '酸味',
                sweet: '甜味',
                bitter: '苦味',
                spicy: '辣味',
                salty: '咸味'
            };
            Object.entries(userPreference.flavorPreference).forEach(([flavor, score]) => {
                const level = score >= 80 ? '非常喜欢' : score >= 60 ? '喜欢' : score >= 40 ? '一般' : score >= 20 ? '不太喜欢' : '很不喜欢';
                userDescription += `- ${flavorNames[flavor]}：${score}分（${level}）\n`;
            });
        }

        // 饮食禁忌
        if (userPreference.dietaryRestrictions && userPreference.dietaryRestrictions.length > 0) {
            userDescription += `\n饮食禁忌：${userPreference.dietaryRestrictions.join('、')}\n`;
        }

        // 过敏原
        if (userPreference.allergies && userPreference.allergies.length > 0) {
            userDescription += `过敏原：${userPreference.allergies.join('、')}\n`;
        }

        // 不喜欢的食材
        if (userPreference.dislikedIngredients && userPreference.dislikedIngredients.length > 0) {
            userDescription += `不喜欢的食材：${userPreference.dislikedIngredients.join('、')}\n`;
        }

        // 当前身体状态
        if (userPreference.currentConditions && userPreference.currentConditions.length > 0) {
            userDescription += `当前身体状态：${userPreference.currentConditions.join('、')}\n`;
        }

        // 用餐场景偏好
        if (userPreference.mealScenarios && userPreference.mealScenarios.length > 0) {
            userDescription += `用餐场景偏好：${userPreference.mealScenarios.join('、')}\n`;
        }

        // 烹饪偏好
        if (userPreference.cookingDifficulty !== undefined) {
            const difficultyNames = ['', '很简单', '简单', '中等', '较难', '困难'];
            userDescription += `烹饪难度偏好：${difficultyNames[userPreference.cookingDifficulty]}（${userPreference.cookingDifficulty}级）\n`;
        }

        if (userPreference.maxCookingTime !== undefined) {
            userDescription += `最大烹饪时间：${userPreference.maxCookingTime}分钟\n`;
        }

        // 用餐类型
        if (mealType) {
            const mealTypeNames = {
                breakfast: '早餐',
                lunch: '午餐',
                dinner: '晚餐',
                snack: '加餐/宵夜'
            };
            userDescription += `\n目标用餐场景：${mealTypeNames[mealType] || mealType}\n`;
        }

        userDescription += `\n请基于以上数据深度分析用户特征，并生成个性化的推荐策略和营养建议。`;

        const useJsonOutput = config.deepseek.enableJsonOutput;
        const model = useJsonOutput ? config.deepseek.jsonOutputModel : config.deepseek.model;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: AI_RECOMMENDATION_PROMPT },
                { role: 'user', content: userDescription }
            ],
            max_tokens: config.deepseek.maxTokens,
            temperature: 0.7,
            stream: false,
            ...(useJsonOutput && { response_format: { type: "json_object" } })
        });

        const content = response.choices[0].message.content.trim();

        // 解析JSON
        let analysisResult;
        try {
            if (useJsonOutput) {
                analysisResult = JSON.parse(content);
            } else {
                const jsonContent = content.replace(/```json\s*|\s*```/g, '');
                analysisResult = JSON.parse(jsonContent);
            }
        } catch (parseError) {
            console.error('AI推荐分析JSON解析失败:', parseError);
            console.error('AI返回内容:', content);
            // 返回默认分析结果
            analysisResult = {
                userProfile: '基于用户偏好的个性化分析',
                recommendStrategy: '根据您的口味偏好和体质特点，为您推荐合适的菜品',
                nutritionBalance: '注重营养均衡，适合日常调养'
            };
        }

        // 验证必要字段
        if (!analysisResult.userProfile) {
            analysisResult.userProfile = '基于用户偏好的个性化分析';
        }
        if (!analysisResult.recommendStrategy) {
            analysisResult.recommendStrategy = '根据您的口味偏好和体质特点，为您推荐合适的菜品';
        }
        if (!analysisResult.nutritionBalance) {
            analysisResult.nutritionBalance = '注重营养均衡，适合日常调养';
        }

        return analysisResult;

    } catch (error) {
        console.error('AI推荐分析失败:', error);
        // 返回默认分析结果
        return {
            userProfile: '基于用户偏好的个性化分析',
            recommendStrategy: '根据您的口味偏好和体质特点，为您推荐合适的菜品',
            nutritionBalance: '注重营养均衡，适合日常调养'
        };
    }
};

/**
 * 基于用户偏好生成AI菜品推荐
 * @param {Object} userPreference - 用户偏好数据
 * @param {string} userConstitution - 用户体质类型
 * @param {string} mealType - 用餐类型（可选）
 * @param {number} count - 推荐数量（可选，默认6个）
 * @param {Array} excludeIngredients - 额外排除的食材（可选）
 * @param {string} specialRequirements - 特殊要求（可选）
 * @returns {Promise<Object>} AI推荐结果
 */
export const generateAIRecipeRecommendations = async (userPreference, userConstitution = null, mealType = null, count = 6, excludeIngredients = [], specialRequirements = null) => {
    try {
        // 构建详细的用户数据描述
        let userDescription = `请根据以下用户偏好数据，生成${count}个全新的个性化菜品推荐：\n\n`;

        // 体质信息
        if (userConstitution) {
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
            userDescription += `体质类型：${constitutionNames[userConstitution]}（${userConstitution}）\n`;
        }

        // 五味偏好
        if (userPreference.flavorPreference) {
            userDescription += `\n五味偏好：\n`;
            const flavorNames = {
                sour: '酸味',
                sweet: '甜味',
                bitter: '苦味',
                spicy: '辣味',
                salty: '咸味'
            };
            Object.entries(userPreference.flavorPreference).forEach(([flavor, score]) => {
                const level = score >= 80 ? '非常喜欢' : score >= 60 ? '喜欢' : score >= 40 ? '一般' : score >= 20 ? '不太喜欢' : '很不喜欢';
                userDescription += `- ${flavorNames[flavor]}：${score}分（${level}）\n`;
            });
        }

        // 饮食禁忌
        if (userPreference.dietaryRestrictions && userPreference.dietaryRestrictions.length > 0) {
            userDescription += `\n饮食禁忌：${userPreference.dietaryRestrictions.join('、')}\n`;
        }

        // 过敏原
        if (userPreference.allergies && userPreference.allergies.length > 0) {
            userDescription += `过敏原：${userPreference.allergies.join('、')}\n`;
        }

        // 不喜欢的食材
        if (userPreference.dislikedIngredients && userPreference.dislikedIngredients.length > 0) {
            userDescription += `不喜欢的食材：${userPreference.dislikedIngredients.join('、')}\n`;
        }

        // 当前身体状态
        if (userPreference.currentConditions && userPreference.currentConditions.length > 0) {
            userDescription += `当前身体状态：${userPreference.currentConditions.join('、')}\n`;
        }

        // 用餐场景偏好
        if (userPreference.mealScenarios && userPreference.mealScenarios.length > 0) {
            userDescription += `用餐场景偏好：${userPreference.mealScenarios.join('、')}\n`;
        }

        // 烹饪偏好
        if (userPreference.cookingDifficulty !== undefined) {
            const difficultyNames = ['', '很简单', '简单', '中等', '较难', '困难'];
            userDescription += `烹饪难度偏好：${difficultyNames[userPreference.cookingDifficulty]}（${userPreference.cookingDifficulty}级）\n`;
        }

        if (userPreference.maxCookingTime !== undefined) {
            userDescription += `最大烹饪时间：${userPreference.maxCookingTime}分钟\n`;
        }

        // 用餐类型
        if (mealType) {
            const mealTypeNames = {
                breakfast: '早餐',
                lunch: '午餐',
                dinner: '晚餐',
                snack: '加餐/宵夜'
            };
            userDescription += `\n目标用餐场景：${mealTypeNames[mealType] || mealType}\n`;
        }

        // 额外排除的食材
        if (excludeIngredients && excludeIngredients.length > 0) {
            userDescription += `额外排除的食材：${excludeIngredients.join('、')}\n`;
        }

        // 特殊要求
        if (specialRequirements) {
            userDescription += `特殊要求：${specialRequirements}\n`;
        }

        userDescription += `\n请严格按照上述要求生成${count}个全新的个性化菜品推荐。`;

        const useJsonOutput = config.deepseek.enableJsonOutput;
        const model = useJsonOutput ? config.deepseek.jsonOutputModel : config.deepseek.model;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: AI_RECIPE_RECOMMENDATION_PROMPT },
                { role: 'user', content: userDescription }
            ],
            max_tokens: config.deepseek.maxTokens,
            temperature: 0.7,
            stream: false,
            ...(useJsonOutput && { response_format: { type: "json_object" } })
        });

        const content = response.choices[0].message.content.trim();

        // 解析JSON
        let recommendationResult;

        if (useJsonOutput) {
            // 使用 JSON Output 时直接解析
            try {
                recommendationResult = JSON.parse(content);
            } catch (parseError) {
                console.error('AI推荐JSON解析失败:', parseError);
                console.error('AI返回内容:', content);
                // 使用默认推荐
                recommendationResult = createDefaultRecommendation(userConstitution, mealType, count);
            }
        } else {
            // 传统方式：尝试多种JSON解析方法
            let lastError = null;

            const jsonExtractionPatterns = [
                /```json\s*([\s\S]*?)\s*```/g,  // 标准markdown格式
                /\{[\s\S]*\}/,                    // 直接查找JSON对象
                /^\s*\{[\s\S]*\}\s*$/m           // 整个内容就是JSON
            ];

            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    let jsonContent = content;

                    // 尝试不同的提取方法
                    if (attempt === 0) {
                        // 标准markdown格式提取
                        const match = content.match(/```json\s*([\s\S]*?)\s*```/);
                        if (match) {
                            jsonContent = match[1];
                        }
                    } else if (attempt === 1) {
                        // 查找第一个JSON对象
                        const match = content.match(/\{[\s\S]*\}/);
                        if (match) {
                            jsonContent = match[0];
                        }
                    } else {
                        // 使用整个内容
                        jsonContent = content.trim();
                    }

                    // 清理和预处理
                    jsonContent = jsonContent
                        .replace(/```json\s*|\s*```/g, '')  // 移除markdown标记
                        .replace(/^\s*[\r\n]+/gm, '')      // 移除空行
                        .trim();

                    console.log(`尝试 ${attempt + 1} - 提取的JSON内容:`, jsonContent.substring(0, 200) + '...');

                    recommendationResult = JSON.parse(jsonContent);

                    // 验证解析结果
                    if (recommendationResult && typeof recommendationResult === 'object') {
                        console.log('JSON解析成功');
                        break;
                    }
                } catch (parseError) {
                    lastError = parseError;
                    console.warn(`解析尝试 ${attempt + 1} 失败:`, parseError.message);
                    console.warn(`尝试 ${attempt + 1} 的内容片段:`, content.substring(0, 300));
                }
            }

            // 如果JSON解析失败，尝试修复部分解析的内容
            if (!recommendationResult) {
                console.error('所有JSON解析尝试都失败了，尝试修复部分内容');
                recommendationResult = attemptPartialJSONFix(content, userConstitution, mealType, count);
            }

            // 如果仍然失败，使用默认推荐
            if (!recommendationResult) {
                console.error('修复也失败，使用默认推荐结果');
                recommendationResult = createDefaultRecommendation(userConstitution, mealType, count);
            }
        }

        // 验证必要字段
        if (!recommendationResult.recommendations || !Array.isArray(recommendationResult.recommendations)) {
            console.warn('recommendations字段不完整，尝试修复');
            // 如果recommendations字段有问题，尝试从content中提取
            if (recommendationResult.recommendations && Array.isArray(recommendationResult.recommendations)) {
                // 过滤掉无效的推荐
                recommendationResult.recommendations = recommendationResult.recommendations.filter(recipe =>
                    recipe && typeof recipe === 'object' && recipe.name && recipe.description
                );
            } else {
                // 完全使用默认推荐
                recommendationResult = createDefaultRecommendation(userConstitution, mealType, count);
            }
        }

        // 验证每个推荐菜品的完整性
        const requiredFields = ['name', 'description', 'nature', 'ingredients', 'steps'];
        recommendationResult.recommendations.forEach((recipe, index) => {
            const missingFields = requiredFields.filter(field => !recipe[field]);
            if (missingFields.length > 0) {
                console.warn(`推荐菜品${index + 1}缺少字段:`, missingFields);
            }
        });

        // 设置默认值
        recommendationResult.userProfile = recommendationResult.userProfile || '基于用户偏好的个性化分析';
        recommendationResult.recommendStrategy = recommendationResult.recommendStrategy || '根据您的口味偏好和体质特点，为您推荐合适的菜品';
        recommendationResult.nutritionBalance = recommendationResult.nutritionBalance || '注重营养均衡，适合日常调养';

        // 为每个菜品设置默认值
        recommendationResult.recommendations = recommendationResult.recommendations.map(recipe => ({
            ...recipe,
            emoji: recipe.emoji || '🍲',
            flavors: recipe.flavors || [],
            meridians: recipe.meridians || [],
            suitableConstitutions: recipe.suitableConstitutions || [],
            avoidConstitutions: recipe.avoidConstitutions || [],
            tags: recipe.tags || [],
            cookingTime: recipe.cookingTime || 30,
            difficulty: recipe.difficulty || '简单',
            nutritionTags: recipe.nutritionTags || ['营养均衡'],
            bestMealTime: recipe.bestMealTime || (mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : mealType === 'dinner' ? '晚餐' : '加餐'),
            seasonalAdvice: recipe.seasonalAdvice || '',
            recommendReason: recipe.recommendReason || '适合您口味偏好的健康选择',
            healthBenefits: recipe.healthBenefits || '有益健康的营养搭配',
            matchScore: 85 + Math.floor(Math.random() * 10), // 模拟匹配分数
            matchReason: recipe.recommendReason || 'AI个性化推荐'
        }));

        return recommendationResult;

    } catch (error) {
        console.error('AI菜品推荐生成失败:', error);
        throw error;
    }
};

/**
 * 尝试修复部分JSON内容
 * @param {string} content - AI返回的原始内容
 * @param {string} userConstitution - 用户体质
 * @param {string} mealType - 用餐类型
 * @param {number} count - 推荐数量
 * @returns {Object|null} 修复后的推荐结果或null
 */
const attemptPartialJSONFix = (content, userConstitution, mealType, count) => {
    try {
        console.log('尝试修复部分JSON内容...');

        // 尝试找到完整的JSON结构
        let jsonStart = content.indexOf('{');
        let jsonEnd = content.lastIndexOf('}');

        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            let partialJSON = content.substring(jsonStart, jsonEnd + 1);

            console.log('修复后的JSON长度:', partialJSON.length);

            // 尝试解析修复后的JSON
            const parsed = JSON.parse(partialJSON);

            if (parsed && typeof parsed === 'object') {
                console.log('部分JSON修复成功！');

                // 如果recommendations字段不完整，尝试修复
                if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                    // 过滤并修复每个推荐项
                    parsed.recommendations = parsed.recommendations
                        .filter(recipe => recipe && typeof recipe === 'object' && recipe.name)
                        .slice(0, count) // 限制数量
                        .map(recipe => ({
                            ...recipe,
                            // 确保必要字段存在
                            ingredients: recipe.ingredients || [],
                            steps: recipe.steps || [],
                            cookingTime: recipe.cookingTime || 30,
                            difficulty: recipe.difficulty || '简单',
                            nature: recipe.nature || '平',
                            flavors: recipe.flavors || [],
                            tags: recipe.tags || [],
                            // 添加匹配分数
                            matchScore: 85 + Math.floor(Math.random() * 10),
                            matchReason: recipe.recommendReason || 'AI个性化推荐'
                        }));
                }

                return parsed;
            }
        }

        return null;
    } catch (error) {
        console.warn('部分JSON修复失败:', error.message);
        return null;
    }
};


/**
 * 创建默认推荐结果（当AI解析失败时使用）
 * @param {string} userConstitution - 用户体质
 * @param {string} mealType - 用餐类型
 * @param {number} count - 推荐数量
 * @returns {Object} 默认推荐结果
 */
const createDefaultRecommendation = (userConstitution, mealType, count = 6) => {
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

    const defaultRecipes = [
        {
            name: "山药莲子粥",
            description: "滋补脾胃，养心安神的营养粥品，适合日常调养",
            emoji: "🥣",
            nature: "平",
            flavors: ["甘", "淡"],
            meridians: ["脾", "胃", "心", "肾"],
            suitableConstitutions: userConstitution ? [userConstitution] : ["balanced"],
            avoidConstitutions: [],
            tags: ["滋补", "养胃", "易消化"],
            ingredients: [
                { name: "山药", amount: "100g", icon: "🥔" },
                { name: "莲子", amount: "30g", icon: "🫘" },
                { name: "大米", amount: "100g", icon: "🍚" }
            ],
            steps: [
                { order: 1, content: "山药去皮切块，莲子去心" },
                { order: 2, content: "大米淘洗干净" },
                { order: 3, content: "所有材料放入锅中加水煮粥" }
            ],
            cookingTime: 30,
            difficulty: "简单",
            nutritionTags: ["易消化", "健脾", "养心"],
            bestMealTime: mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : mealType === 'dinner' ? '晚餐' : '加餐',
            seasonalAdvice: "秋冬季节食用更佳",
            recommendReason: "性味平和，滋补养生，适合日常调养",
            healthBenefits: "健脾益气，养心安神",
            matchScore: 85,
            matchReason: "性味平和，适合日常调养"
        },
        {
            name: "银耳莲子汤",
            description: "滋阴润燥，清心安神的甜品汤品",
            emoji: "🍵",
            nature: "凉",
            flavors: ["甘", "淡"],
            meridians: ["肺", "心", "肾"],
            suitableConstitutions: userConstitution ? [userConstitution] : ["balanced"],
            avoidConstitutions: [],
            tags: ["滋阴", "润燥", "清心"],
            ingredients: [
                { name: "银耳", amount: "15g", icon: "🍄" },
                { name: "莲子", amount: "30g", icon: "🫘" },
                { name: "红枣", amount: "6颗", icon: "🔴" }
            ],
            steps: [
                { order: 1, content: "银耳提前泡发，撕成小朵" },
                { order: 2, content: "莲子去心，红枣去核" },
                { order: 3, content: "所有材料放入锅中炖煮30分钟" }
            ],
            cookingTime: 40,
            difficulty: "简单",
            nutritionTags: ["滋阴", "润燥", "美容"],
            bestMealTime: mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : mealType === 'dinner' ? '晚餐' : '加餐',
            seasonalAdvice: "秋季食用效果更佳",
            recommendReason: "滋阴润燥，适合干燥季节食用",
            healthBenefits: "滋阴润肺，养心安神",
            matchScore: 82,
            matchReason: "滋阴润燥，适合养生"
        }
    ];

    // 生成指定数量的推荐
    const recommendations = [];
    for (let i = 0; i < Math.min(count, defaultRecipes.length); i++) {
        recommendations.push(defaultRecipes[i]);
    }

    // 如果需要更多推荐，复制并修改第一个推荐
    while (recommendations.length < count) {
        const baseRecipe = defaultRecipes[0];
        const newRecipe = {
            ...baseRecipe,
            name: baseRecipe.name + `（变体${recommendations.length + 1}）`,
            matchScore: 80 + Math.floor(Math.random() * 10)
        };
        recommendations.push(newRecipe);
    }

    return {
        userProfile: `您属于${constitutionNames[userConstitution] || '平和质'}，需要个性化的饮食调理方案。`,
        recommendStrategy: "基于您的体质特点，为您推荐适合的调养菜品，注重营养均衡和性味搭配。",
        nutritionBalance: "建议饮食以温补为主，注重营养均衡，避免过于寒凉或燥热的食物。",
        recommendations
    };
};

/**
 * 为单个菜品生成个性化推荐理由
 * @param {Object} recipe - 菜谱对象
 * @param {Object} userPreference - 用户偏好
 * @param {string} userConstitution - 用户体质
 * @param {string} mealType - 用餐类型
 * @returns {Promise<Object>} 个性化推荐信息
 */
export const generatePersonalizedRecommendation = async (recipe, userPreference, userConstitution = null, mealType = null) => {
    try {
        // 构建菜品和用户信息
        let recommendationPrompt = `请为以下菜品生成个性化推荐理由：

菜品信息：
- 名称：${recipe.name}
- 性味：${recipe.nature}
- 口味：${recipe.flavors ? recipe.flavors.join('、') : '无'}
- 功效特点：${recipe.description || '无'}
- 烹饪时间：${recipe.cookingTime}分钟
- 难度：${recipe.difficulty || '简单'}

`;

        // 添加用户信息
        if (userConstitution) {
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
            recommendationPrompt += `用户体质：${constitutionNames[userConstitution]}\n`;
        }

        if (userPreference.flavorPreference) {
            const favoriteFlavors = [];
            Object.entries(userPreference.flavorPreference).forEach(([flavor, score]) => {
                if (score >= 60) {
                    const flavorNames = {
                        sour: '酸', sweet: '甜', bitter: '苦', spicy: '辣', salty: '咸'
                    };
                    favoriteFlavors.push(flavorNames[flavor]);
                }
            });
            if (favoriteFlavors.length > 0) {
                recommendationPrompt += `用户喜欢的口味：${favoriteFlavors.join('、')}\n`;
            }
        }

        if (mealType) {
            const mealTypeNames = {
                breakfast: '早餐',
                lunch: '午餐',
                dinner: '晚餐',
                snack: '加餐/宵夜'
            };
            recommendationPrompt += `用餐场景：${mealTypeNames[mealType] || mealType}\n`;
        }

        recommendationPrompt += `
请生成JSON格式的个性化推荐信息，包括：
1. reason: 详细推荐理由（50-100字）
2. nutritionTags: 营养标签数组（如["高蛋白", "低脂", "补铁"]）
3. bestMealTime: 最佳用餐时间建议
4. seasonalAdvice: 季节性建议（可选）

JSON格式数据结构：
{
  "reason": "个性化推荐理由",
  "nutritionTags": ["标签1", "标签2"],
  "bestMealTime": "早餐|午餐|晚餐|加餐",
  "seasonalAdvice": "季节性建议"
}`;

        const useJsonOutput = config.deepseek.enableJsonOutput;
        const model = useJsonOutput ? config.deepseek.jsonOutputModel : config.deepseek.model;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: '你是专业的营养师，擅长生成个性化的菜品推荐理由。请返回纯JSON格式，不要包含其他文字。' },
                { role: 'user', content: recommendationPrompt }
            ],
            max_tokens: 500,
            temperature: 0.6,
            stream: false,
            ...(useJsonOutput && { response_format: { type: "json_object" } })
        });

        const content = response.choices[0].message.content.trim();

        // 解析JSON
        let recommendationResult;
        try {
            if (useJsonOutput) {
                recommendationResult = JSON.parse(content);
            } else {
                const jsonContent = content.replace(/```json\s*|\s*```/g, '');
                recommendationResult = JSON.parse(jsonContent);
            }
        } catch (parseError) {
            console.error('个性化推荐JSON解析失败:', parseError);
            console.error('AI返回内容:', content);
            // 返回默认推荐信息
            recommendationResult = {
                reason: '适合您口味偏好的健康选择',
                nutritionTags: ['营养均衡'],
                bestMealTime: mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : mealType === 'dinner' ? '晚餐' : '加餐',
                seasonalAdvice: ''
            };
        }

        // 设置默认值
        recommendationResult.reason = recommendationResult.reason || '适合您口味偏好的健康选择';
        recommendationResult.nutritionTags = recommendationResult.nutritionTags || ['营养均衡'];
        recommendationResult.bestMealTime = recommendationResult.bestMealTime || (mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : mealType === 'dinner' ? '晚餐' : '加餐');
        recommendationResult.seasonalAdvice = recommendationResult.seasonalAdvice || '';

        return recommendationResult;

    } catch (error) {
        console.error('生成个性化推荐失败:', error);
        return {
            reason: '适合您口味偏好的健康选择',
            nutritionTags: ['营养均衡'],
            bestMealTime: mealType === 'breakfast' ? '早餐' : mealType === 'lunch' ? '午餐' : mealType === 'dinner' ? '晚餐' : '加餐',
            seasonalAdvice: ''
        };
    }
};

export default {
    chat,
    chatStream,
    generateRecipeJSON,
    validateRecipeJSON,
    analyzeUserPreferenceForRecommendation,
    generatePersonalizedRecommendation,
    generateAIRecipeRecommendations
};

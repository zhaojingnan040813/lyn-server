/**
 * 推荐算法服务
 * 基于体质和偏好计算菜谱匹配度
 */

/**
 * 计算单个菜谱的匹配度分数
 * @param {Object} recipe - 菜谱对象
 * @param {Object} userProfile - 用户信息（包含体质和偏好）
 * @returns {Object} 包含分数和原因的对象
 */
export const calculateMatchScore = (recipe, userProfile) => {
    let score = recipe.baseScore || 80;
    let reasons = [];

    const constitution = userProfile?.constitution?.type;
    const preferences = userProfile?.preferences;

    // 如果没有用户偏好信息，返回基础分数
    if (!constitution && !preferences) {
        return {
            score: score,
            matchReason: '性味平和，适合日常调养'
        };
    }

    // ========== 体质匹配计算 ==========
    if (constitution) {
        // 适宜体质加分
        if (recipe.suitableConstitutions && recipe.suitableConstitutions.includes(constitution)) {
            score += 10;
            reasons.push('适合您的体质');
        }

        // 不适宜体质减分
        if (recipe.avoidConstitutions && recipe.avoidConstitutions.includes(constitution)) {
            score -= 20;
            reasons.push('不太适合您的体质');
        }

        // 根据体质类型和菜谱性味进行调整
        const natureScore = calculateNatureScore(recipe.nature, constitution);
        score += natureScore.score;
        if (natureScore.reason) {
            reasons.push(natureScore.reason);
        }
    }

    // ========== 口味偏好计算 ==========
    if (preferences && preferences.flavors) {
        const flavorScore = calculateFlavorScore(recipe.flavors, preferences.flavors);
        score += flavorScore;
    }

    // ========== 禁忌食材检查 ==========
    if (preferences && preferences.exclusions && preferences.exclusions.length > 0) {
        const hasExcluded = checkExclusions(recipe.ingredients, preferences.exclusions);
        if (hasExcluded) {
            score -= 30;
            reasons.push('含有您忌口的食材');
        }
    }

    // ========== 当前状态调整 ==========
    if (preferences && preferences.currentConditions && preferences.currentConditions.length > 0) {
        const contextScore = calculateContextScore(recipe, preferences.currentConditions);
        score += contextScore.score;
        if (contextScore.reason) {
            reasons.push(contextScore.reason);
        }
    }

    // ========== 烹饪时间偏好 ==========
    if (preferences && preferences.maxCookingTime) {
        if (recipe.cookingTime <= preferences.maxCookingTime) {
            score += 3; // 符合时间要求加分
        } else if (recipe.cookingTime > preferences.maxCookingTime * 1.5) {
            score -= 5; // 超时太多减分
        }
    }

    // ========== 烹饪难度偏好 ==========
    if (preferences && preferences.cookingDifficulty) {
        const difficultyMap = { '简单': 1, '中等': 2, '困难': 3 };
        const recipeDifficulty = difficultyMap[recipe.difficulty] || 2;

        if (recipeDifficulty <= preferences.cookingDifficulty) {
            score += 2; // 难度适中加分
        } else if (recipeDifficulty > preferences.cookingDifficulty + 1) {
            score -= 3; // 难度过高减分
        }
    }

    // ========== 用餐场景偏好 ==========
    if (preferences && preferences.mealScenarios && preferences.mealScenarios.length > 0) {
        const scenarioScore = calculateScenarioScore(recipe, preferences.mealScenarios);
        score += scenarioScore.score;
        if (scenarioScore.reason) {
            reasons.push(scenarioScore.reason);
        }
    }

    // 确保分数在合理范围内
    score = Math.max(50, Math.min(99, score));

    // 生成匹配原因文本
    const matchReason = generateMatchReason(score, constitution, reasons);

    return {
        score: Math.round(score),
        matchReason
    };
};

/**
 * 根据体质和食物性味计算分数
 */
const calculateNatureScore = (nature, constitution) => {
    const result = { score: 0, reason: '' };

    // 阳虚体质偏好温热
    if (constitution === 'yang_deficiency') {
        if (nature === '温' || nature === '热') {
            result.score = 5;
            result.reason = '温补之品，适合阳虚体质';
        } else if (nature === '凉' || nature === '寒') {
            result.score = -10;
            result.reason = '性凉，阳虚体质慎食';
        }
    }

    // 阴虚体质偏好凉润
    if (constitution === 'yin_deficiency') {
        if (nature === '凉' || nature === '平') {
            result.score = 5;
            result.reason = '清润之品，适合阴虚体质';
        } else if (nature === '热') {
            result.score = -10;
            result.reason = '性热燥，阴虚体质慎食';
        }
    }

    // 湿热体质偏好清凉
    if (constitution === 'damp_heat') {
        if (nature === '凉' || nature === '寒') {
            result.score = 5;
            result.reason = '清热之品，适合湿热体质';
        } else if (nature === '热') {
            result.score = -10;
            result.reason = '性热，湿热体质慎食';
        }
    }

    // 痰湿体质偏好温燥
    if (constitution === 'phlegm_dampness') {
        if (nature === '温') {
            result.score = 3;
            result.reason = '温化痰湿';
        } else if (nature === '寒') {
            result.score = -5;
        }
    }

    // 气虚体质偏好温补
    if (constitution === 'qi_deficiency') {
        if (nature === '温' || nature === '平') {
            result.score = 5;
            result.reason = '补气之品，适合气虚体质';
        } else if (nature === '寒') {
            result.score = -5;
        }
    }

    // 血瘀体质偏好活血
    if (constitution === 'blood_stasis') {
        if (nature === '温') {
            result.score = 3;
            result.reason = '温通血脉';
        }
    }

    // 气郁体质偏好疏肝
    if (constitution === 'qi_stagnation') {
        if (nature === '平' || nature === '温') {
            result.score = 3;
        }
    }

    return result;
};

/**
 * 根据口味偏好计算分数
 */
const calculateFlavorScore = (recipeFlavors, userFlavors) => {
    if (!recipeFlavors || recipeFlavors.length === 0) return 0;

    let score = 0;
    const flavorMap = {
        '酸': 'sour',
        '甘': 'sweet',
        '苦': 'bitter',
        '辛': 'spicy',
        '咸': 'salty'
    };

    recipeFlavors.forEach(flavor => {
        const flavorKey = flavorMap[flavor];
        if (flavorKey && userFlavors[flavorKey] !== undefined) {
            const preference = userFlavors[flavorKey];
            // 用户偏好 0-4，2 为中等
            if (preference >= 3) {
                score += 3; // 用户喜欢这个口味
            } else if (preference <= 1) {
                score -= 5; // 用户不喜欢这个口味
            }
        }
    });

    return score;
};

/**
 * 检查是否含有禁忌食材
 */
const checkExclusions = (ingredients, exclusions) => {
    if (!ingredients || !exclusions) return false;

    const exclusionKeywords = {
        seafood: ['海鲜', '虾', '蟹', '鱼', '贝', '海参', '鲍鱼'],
        cilantro: ['香菜', '芫荽'],
        spicy: ['辣椒', '辣', '花椒', '胡椒'],
        garlic: ['大蒜', '蒜'],
        onion: ['洋葱', '葱'],
        ginger: ['生姜', '姜'],
        nuts: ['花生', '核桃', '杏仁', '坚果', '腰果'],
        milk: ['牛奶', '奶', '乳'],
        egg: ['鸡蛋', '蛋'],
        gluten: ['面粉', '面条', '小麦'],
        meat: ['肉', '猪', '牛', '羊', '鸡', '鸭'],
        alcohol: ['酒', '米酒', '料酒', '黄酒']
    };

    for (const exclusion of exclusions) {
        const keywords = exclusionKeywords[exclusion] || [exclusion];
        for (const ingredient of ingredients) {
            for (const keyword of keywords) {
                if (ingredient.name && ingredient.name.includes(keyword)) {
                    return true;
                }
            }
        }
    }

    return false;
};

/**
 * 根据当前状态计算分数
 */
const calculateContextScore = (recipe, contexts) => {
    const result = { score: 0, reason: '' };

    contexts.forEach(context => {
        switch (context) {
            case 'menstrual':
                // 生理期避免寒凉，适宜温补
                if (recipe.nature === '温' || recipe.nature === '热') {
                    result.score += 5;
                    result.reason = '温补气血，适合生理期';
                } else if (recipe.nature === '寒' || recipe.nature === '凉') {
                    result.score -= 10;
                }
                break;
            case 'stayup':
                // 熬夜后适宜滋阴清热
                if (recipe.nature === '凉' || recipe.nature === '平') {
                    result.score += 3;
                    result.reason = '滋阴润燥，适合熬夜后调理';
                }
                break;
            case 'cold':
                // 感冒适宜清淡温和
                if (recipe.nature === '温' && recipe.cookingTime <= 30) {
                    result.score += 3;
                    result.reason = '温和易消化，适合感冒期间';
                }
                break;
            case 'exercise':
                // 运动后补充蛋白质
                if (recipe.tags && recipe.tags.includes('高蛋白')) {
                    result.score += 5;
                }
                break;
            case 'hangover':
                // 宿醉后适宜清淡
                if (recipe.nature === '平' || recipe.nature === '凉') {
                    result.score += 3;
                    result.reason = '清淡养胃，适合解酒后';
                }
                break;
            case 'pregnant':
                // 孕期适宜温和滋补，避免寒凉和活血
                if (recipe.nature === '平' || recipe.nature === '温') {
                    result.score += 3;
                }
                if (recipe.avoidConstitutions && recipe.tags && recipe.tags.includes('活血')) {
                    result.score -= 15;
                }
                break;
        }
    });

    return result;
};

/**
 * 根据用餐场景计算分数
 */
const calculateScenarioScore = (recipe, scenarios) => {
    const result = { score: 0, reason: '' };

    scenarios.forEach(scenario => {
        switch (scenario) {
            case '宵夜':
                // 宵夜偏好清淡、易消化
                if (recipe.nature === '平' && recipe.cookingTime <= 30) {
                    result.score += 3;
                    result.reason = '清淡易消化，适合宵夜';
                } else if (recipe.difficulty === '困难') {
                    result.score -= 2;
                }
                break;
            case '约会':
                // 约会偏好精致、美观
                if (recipe.tags && (recipe.tags.includes('精致') || recipe.tags.includes('美观'))) {
                    result.score += 4;
                    result.reason = '精致美观，适合约会用餐';
                } else if (recipe.cookingTime > 90) {
                    result.score -= 2;
                }
                break;
            case '家庭聚餐':
                // 家庭聚餐偏好分量足、适合多人
                if (recipe.tags && recipe.tags.includes('家常菜')) {
                    result.score += 3;
                    result.reason = '家常美味，适合家庭聚餐';
                }
                break;
            case '上班族':
                // 上班族偏好快手菜、可预制
                if (recipe.cookingTime <= 45 && recipe.difficulty !== '困难') {
                    result.score += 3;
                    result.reason = '制作快捷，适合上班族';
                }
                break;
            case '养生':
                // 养生偏好滋补、调理
                if (recipe.tags && (recipe.tags.includes('滋补') || recipe.tags.includes('调理'))) {
                    result.score += 5;
                    result.reason = '滋补调理，适合养生需求';
                }
                break;
        }
    });

    return result;
};

/**
 * 根据烹饪时间偏好计算分数
 */
const calculateTimeScore = (recipeCookingTime, preferredTime) => {
    switch (preferredTime) {
        case 'quick':
            if (recipeCookingTime <= 20) return 5;
            if (recipeCookingTime <= 30) return 2;
            if (recipeCookingTime > 60) return -5;
            break;
        case 'normal':
            if (recipeCookingTime >= 20 && recipeCookingTime <= 60) return 3;
            break;
        case 'slow':
            if (recipeCookingTime >= 60) return 5;
            break;
    }
    return 0;
};

/**
 * 生成匹配原因文本
 */
const generateMatchReason = (score, constitution, reasons) => {
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

    // 如果有具体原因，返回第一个
    if (reasons.length > 0) {
        return reasons[0];
    }

    // 根据分数生成通用文本
    if (score >= 90) {
        return constitution
            ? `非常适合您的${constitutionNames[constitution] || '体质'}`
            : '非常适合您';
    } else if (score >= 80) {
        return constitution
            ? `适合您的${constitutionNames[constitution] || '体质'}`
            : '适合您的口味偏好';
    } else if (score >= 70) {
        return '性味平和，适合日常调养';
    } else {
        return '可尝试，但不是最佳选择';
    }
};

/**
 * 为菜谱列表计算匹配度并排序
 * @param {Array} recipes - 菜谱列表
 * @param {Object} userProfile - 用户信息
 * @returns {Array} 带匹配度的排序后菜谱列表
 */
export const rankRecipes = (recipes, userProfile) => {
    const rankedRecipes = recipes.map(recipe => {
        const recipeObj = recipe.toObject ? recipe.toObject() : recipe;
        const { score, matchReason } = calculateMatchScore(recipeObj, userProfile);
        return {
            ...recipeObj,
            matchScore: score,
            matchReason
        };
    });

    // 按匹配度降序排序
    rankedRecipes.sort((a, b) => b.matchScore - a.matchScore);

    return rankedRecipes;
};

export default {
    calculateMatchScore,
    rankRecipes
};

/**
 * 九种体质类型种子数据
 * 基于中医体质学说
 */
export const constitutionSeeds = [
    {
        type: 'balanced',
        name: '平和质',
        description: '阴阳气血调和，体态适中，面色红润，精力充沛',
        characteristics: [
            '体形匀称健壮',
            '面色润泽',
            '精力充沛',
            '睡眠良好',
            '二便正常'
        ],
        dietaryGuidelines: {
            recommended: ['五谷杂粮', '新鲜蔬果', '适量肉类', '豆制品'],
            avoided: ['过度辛辣', '过于油腻', '生冷过度']
        },
        recommendedIngredients: ['大米', '小麦', '玉米', '苹果', '胡萝卜', '鸡肉', '鱼肉'],
        flavorPreference: { sour: 50, sweet: 50, bitter: 50, spicy: 50, salty: 50 },
        icon: '☯️',
        color: '#4CAF50',
        sortOrder: 1
    },
    {
        type: 'qi_deficiency',
        name: '气虚质',
        description: '元气不足，疲乏气短，容易出汗，抵抗力较弱',
        characteristics: [
            '容易疲劳',
            '气短懒言',
            '容易出汗',
            '抵抗力差',
            '容易感冒'
        ],
        dietaryGuidelines: {
            recommended: ['黄芪', '党参', '山药', '大枣', '鸡肉', '牛肉'],
            avoided: ['生冷食物', '油腻难消化', '耗气食物如萝卜']
        },
        recommendedIngredients: ['黄芪', '党参', '山药', '大枣', '糯米', '小米', '鸡肉', '牛肉', '香菇'],
        flavorPreference: { sour: 40, sweet: 70, bitter: 30, spicy: 40, salty: 40 },
        icon: '🌬️',
        color: '#FFC107',
        sortOrder: 2
    },
    {
        type: 'yang_deficiency',
        name: '阳虚质',
        description: '阳气不足，畏寒怕冷，手脚冰凉，喜热饮食',
        characteristics: [
            '畏寒怕冷',
            '手脚冰凉',
            '喜热饮食',
            '精神不振',
            '大便稀溏'
        ],
        dietaryGuidelines: {
            recommended: ['羊肉', '韭菜', '生姜', '桂圆', '核桃', '肉桂'],
            avoided: ['生冷瓜果', '冷饮', '苦寒食物']
        },
        recommendedIngredients: ['羊肉', '韭菜', '生姜', '桂圆', '核桃', '肉桂', '红枣', '糯米'],
        flavorPreference: { sour: 30, sweet: 60, bitter: 20, spicy: 70, salty: 50 },
        icon: '❄️',
        color: '#03A9F4',
        sortOrder: 3
    },
    {
        type: 'yin_deficiency',
        name: '阴虚质',
        description: '阴液亏少，口燥咽干，手足心热，喜冷饮',
        characteristics: [
            '手足心热',
            '口干咽燥',
            '喜冷饮',
            '大便干燥',
            '舌红少苔'
        ],
        dietaryGuidelines: {
            recommended: ['银耳', '百合', '枸杞', '鸭肉', '甲鱼', '梨'],
            avoided: ['辛辣刺激', '煎炸烧烤', '温燥食物']
        },
        recommendedIngredients: ['银耳', '百合', '枸杞', '鸭肉', '梨', '莲子', '绿豆', '冬瓜'],
        flavorPreference: { sour: 60, sweet: 50, bitter: 40, spicy: 20, salty: 40 },
        icon: '🔥',
        color: '#FF5722',
        sortOrder: 4
    },
    {
        type: 'phlegm_dampness',
        name: '痰湿质',
        description: '痰湿凝聚，形体肥胖，腹部肥满，容易困倦',
        characteristics: [
            '形体肥胖',
            '腹部肥满松软',
            '容易困倦',
            '痰多',
            '口黏腻'
        ],
        dietaryGuidelines: {
            recommended: ['薏米', '冬瓜', '山楂', '荷叶', '陈皮', '白萝卜'],
            avoided: ['肥甘厚味', '甜食', '油腻食物']
        },
        recommendedIngredients: ['薏米', '冬瓜', '山楂', '荷叶', '陈皮', '白萝卜', '海带', '绿豆'],
        flavorPreference: { sour: 50, sweet: 30, bitter: 60, spicy: 50, salty: 30 },
        icon: '💧',
        color: '#795548',
        sortOrder: 5
    },
    {
        type: 'damp_heat',
        name: '湿热质',
        description: '湿热内蕴，面垢油光，口苦口干，容易长痘',
        characteristics: [
            '面垢油光',
            '口苦口干',
            '容易长痘',
            '大便黏滞',
            '小便短黄'
        ],
        dietaryGuidelines: {
            recommended: ['绿豆', '苦瓜', '黄瓜', '薏米', '冬瓜', '芹菜'],
            avoided: ['辛辣油腻', '牛羊肉', '酒类']
        },
        recommendedIngredients: ['绿豆', '苦瓜', '黄瓜', '薏米', '冬瓜', '芹菜', '莲藕', '西瓜'],
        flavorPreference: { sour: 40, sweet: 30, bitter: 70, spicy: 20, salty: 40 },
        icon: '🌡️',
        color: '#FF9800',
        sortOrder: 6
    },
    {
        type: 'blood_stasis',
        name: '血瘀质',
        description: '血行不畅，面色晦暗，容易出现瘀斑，肤色暗沉',
        characteristics: [
            '面色晦暗',
            '皮肤粗糙',
            '容易出现瘀斑',
            '口唇暗淡',
            '舌质紫暗'
        ],
        dietaryGuidelines: {
            recommended: ['山楂', '红糖', '玫瑰花', '黑木耳', '醋', '桃仁'],
            avoided: ['寒凉食物', '高脂肪食物']
        },
        recommendedIngredients: ['山楂', '红糖', '玫瑰花', '黑木耳', '桃仁', '红花', '当归', '川芎'],
        flavorPreference: { sour: 60, sweet: 40, bitter: 40, spicy: 50, salty: 40 },
        icon: '🩸',
        color: '#9C27B0',
        sortOrder: 7
    },
    {
        type: 'qi_stagnation',
        name: '气郁质',
        description: '气机郁滞，情绪抑郁，容易焦虑，胸闷不舒',
        characteristics: [
            '情绪低落',
            '容易焦虑',
            '胸闷不舒',
            '叹气频繁',
            '咽部异物感'
        ],
        dietaryGuidelines: {
            recommended: ['玫瑰花', '佛手', '陈皮', '柑橘', '小麦', '百合'],
            avoided: ['收敛酸涩', '过于寒凉']
        },
        recommendedIngredients: ['玫瑰花', '佛手', '陈皮', '柑橘', '小麦', '百合', '金桔', '茉莉花'],
        flavorPreference: { sour: 40, sweet: 50, bitter: 50, spicy: 50, salty: 40 },
        icon: '😔',
        color: '#607D8B',
        sortOrder: 8
    },
    {
        type: 'special',
        name: '特禀质',
        description: '先天禀赋不足或过敏体质，容易过敏，适应能力差',
        characteristics: [
            '容易过敏',
            '适应能力差',
            '容易打喷嚏',
            '皮肤易起疹',
            '对气候敏感'
        ],
        dietaryGuidelines: {
            recommended: ['新鲜蔬果', '清淡饮食', '糙米', '适量蛋白质'],
            avoided: ['海鲜发物', '辛辣刺激', '已知过敏原']
        },
        recommendedIngredients: ['糙米', '小米', '南瓜', '胡萝卜', '苹果', '葡萄'],
        flavorPreference: { sour: 40, sweet: 50, bitter: 40, spicy: 30, salty: 40 },
        icon: '🌸',
        color: '#E91E63',
        sortOrder: 9
    }
];

export default constitutionSeeds;

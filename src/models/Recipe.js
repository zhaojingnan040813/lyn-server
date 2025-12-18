import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * 食材子文档 Schema
 */
const ingredientSchema = new Schema({
    name: {
        type: String
    },
    amount: {
        type: String
    },
    icon: {
        type: String,
        default: '🥬'
    }
}, { _id: false });

/**
 * 烹饪步骤子文档 Schema
 */
const stepSchema = new Schema({
    order: {
        type: Number
    },
    content: {
        type: String
    }
}, { _id: false });

/**
 * 菜谱 Schema
 */
const recipeSchema = new Schema({
    // 基本信息
    name: {
        type: String,
        trim: true,
        index: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: ''
    },
    emoji: {
        type: String,
        default: '🍲'
    },

    // 性味归经
    nature: {
        type: String
    },
    flavors: [{
        type: String
    }],
    meridians: [{
        type: String
    }],

    // 体质适宜性
    suitableConstitutions: [{
        type: String,
        enum: [
            'balanced',
            'qi_deficiency',
            'yang_deficiency',
            'yin_deficiency',
            'phlegm_dampness',
            'damp_heat',
            'blood_stasis',
            'qi_stagnation',
            'special'
        ]
    }],
    avoidConstitutions: [{
        type: String,
        enum: [
            'balanced',
            'qi_deficiency',
            'yang_deficiency',
            'yin_deficiency',
            'phlegm_dampness',
            'damp_heat',
            'blood_stasis',
            'qi_stagnation',
            'special'
        ]
    }],

    // 分类标签
    category: {
        type: String,
        enum: ['warming', 'cooling', 'neutral', 'quick'],
        default: 'neutral'
    },
    tags: [{
        type: String
    }],

    // 烹饪信息
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    cookingTime: {
        type: Number,
        default: 30,
        min: 0
    },
    difficulty: {
        type: String,
        enum: ['简单', '中等', '困难'],
        default: '简单'
    },

    // 食养分析
    analysis: {
        type: String,
        default: ''
    },

    // 基础匹配分数
    baseScore: {
        type: Number,
        default: 80,
        min: 0,
        max: 100
    },

    // 状态
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 索引
recipeSchema.index({ name: 'text', description: 'text' });
recipeSchema.index({ category: 1, isActive: 1 });
recipeSchema.index({ suitableConstitutions: 1 });
recipeSchema.index({ nature: 1 });

/**
 * 虚拟字段：格式化的归经显示
 */
recipeSchema.virtual('meridianText').get(function () {
    if (this.meridians && this.meridians.length > 0) {
        return `入${this.meridians.join('、')}`;
    }
    return '';
});

/**
 * 静态方法：根据筛选条件获取菜谱列表
 */
recipeSchema.statics.findByFilter = async function (filter = {}) {
    const query = { isActive: true };

    // 分类筛选
    if (filter.category && filter.category !== 'recommended') {
        if (filter.category === 'warming') {
            query.nature = { $in: ['温', '热'] };
        } else if (filter.category === 'cooling') {
            query.nature = { $in: ['凉', '寒'] };
        } else if (filter.category === 'quick') {
            query.cookingTime = { $lte: 30 };
        }
    }

    // 关键词搜索
    if (filter.keyword) {
        query.$or = [
            { name: { $regex: filter.keyword, $options: 'i' } },
            { description: { $regex: filter.keyword, $options: 'i' } },
            { 'ingredients.name': { $regex: filter.keyword, $options: 'i' } }
        ];
    }

    // 体质筛选
    if (filter.constitution) {
        query.suitableConstitutions = filter.constitution;
    }

    return this.find(query).sort({ sortOrder: 1, baseScore: -1 });
};

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;

import mongoose from 'mongoose';

const constitutionSchema = new mongoose.Schema({
    // 体质类型标识
    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['balanced', 'qi_deficiency', 'yang_deficiency', 'yin_deficiency',
            'phlegm_dampness', 'damp_heat', 'blood_stasis', 'qi_stagnation', 'special']
    },
    // 体质名称
    name: {
        type: String,
        required: true
    },
    // 体质描述
    description: {
        type: String,
        required: true
    },
    // 主要特征
    characteristics: [{
        type: String
    }],
    // 饮食宜忌
    dietaryGuidelines: {
        // 宜吃食物
        recommended: [{
            type: String
        }],
        // 忌吃食物
        avoided: [{
            type: String
        }]
    },
    // 推荐食材类型
    recommendedIngredients: [{
        type: String
    }],
    // 五味偏好 (酸甜苦辣咸)
    flavorPreference: {
        sour: { type: Number, min: 0, max: 100, default: 50 },
        sweet: { type: Number, min: 0, max: 100, default: 50 },
        bitter: { type: Number, min: 0, max: 100, default: 50 },
        spicy: { type: Number, min: 0, max: 100, default: 50 },
        salty: { type: Number, min: 0, max: 100, default: 50 }
    },
    // 图标
    icon: {
        type: String,
        default: ''
    },
    // 颜色主题
    color: {
        type: String,
        default: '#4CAF50'
    },
    // 排序权重
    sortOrder: {
        type: Number,
        default: 0
    },
    // 是否启用
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'constitutions'
});

// 创建索引
constitutionSchema.index({ type: 1 });
constitutionSchema.index({ isActive: 1, sortOrder: 1 });

const Constitution = mongoose.model('Constitution', constitutionSchema);

export default Constitution;

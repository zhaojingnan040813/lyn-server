import mongoose from 'mongoose';

const userPreferenceSchema = new mongoose.Schema({
    // 关联用户
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // 五味偏好 (0-100)
    flavorPreference: {
        sour: { type: Number, min: 0, max: 100, default: 50 },
        sweet: { type: Number, min: 0, max: 100, default: 50 },
        bitter: { type: Number, min: 0, max: 100, default: 50 },
        spicy: { type: Number, min: 0, max: 100, default: 50 },
        salty: { type: Number, min: 0, max: 100, default: 50 }
    },
    // 饮食禁忌
    dietaryRestrictions: [{
        type: String
    }],
    // 过敏原
    allergies: [{
        type: String
    }],
    // 不喜欢的食材
    dislikedIngredients: [{
        type: String
    }],
    // 当前身体状态
    currentConditions: [{
        type: String
    }],
    // 用餐场景偏好
    mealScenarios: [{
        type: String
    }],
    // 烹饪难度偏好 (1-5)
    cookingDifficulty: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    // 烹饪时间偏好 (分钟)
    maxCookingTime: {
        type: Number,
        default: 60
    }
}, {
    timestamps: true,
    collection: 'user_preferences'
});

// 确保一个用户只有一个偏好设置
userPreferenceSchema.index({ userId: 1 }, { unique: true });

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

export default UserPreference;

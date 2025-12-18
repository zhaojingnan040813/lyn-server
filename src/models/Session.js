import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    data: {
        type: Object,
        default: {}
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    }
}, {
    timestamps: true,
    collection: 'sessions'
});

// 索引：自动删除过期的session
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 检查session是否已过期
sessionSchema.methods.isExpired = function () {
    return this.expiresAt < new Date();
};

// 更新过期时间
sessionSchema.methods.extendExpiration = function (days = 7) {
    this.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return this.save();
};

const Session = mongoose.model('Session', sessionSchema);

export default Session;

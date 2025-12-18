import { User } from '../models/index.js';

/**
 * 数据迁移脚本：为现有匿名用户添加userType字段
 * 确保与新的认证系统兼容
 */
export const migrateAnonymousUsers = async () => {
    try {
        console.log('开始迁移用户数据...');

        // 查找所有没有userType的用户（现有的匿名用户）
        const anonymousUsers = await User.find({ userType: { $exists: false } });

        console.log(`找到 ${anonymousUsers.length} 个需要迁移的用户`);

        for (const user of anonymousUsers) {
            // 设置为匿名用户
            user.userType = 'anonymous';
            user.role = 'user';

            // 如果没有密码，保持为空（匿名用户不需要密码）
            if (!user.password) {
                user.password = undefined;
            }

            await user.save();
            console.log(`迁移用户: ${user.sessionId}`);
        }

        console.log('用户数据迁移完成');

        // 创建索引以提高查询性能
        await User.createIndexes();
        console.log('索引创建完成');

        return {
            success: true,
            migratedCount: anonymousUsers.length
        };
    } catch (error) {
        console.error('用户数据迁移失败:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * 创建管理员账户（如果不存在）
 */
export const createAdminUser = async (username = 'admin', password = 'admin123') => {
    try {
        // 检查是否已存在管理员
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('管理员账户已存在');
            return {
                success: true,
                message: '管理员账户已存在'
            };
        }

        // 创建管理员账户
        const admin = new User({
            username,
            password,
            userType: 'admin',
            role: 'admin',
            sessionId: `admin_${Date.now()}`,
            loginCount: 0
        });

        await admin.save();
        console.log(`管理员账户创建成功: ${username}`);

        return {
            success: true,
            message: `管理员账户创建成功: ${username}`,
            admin: admin.toSafeObject()
        };
    } catch (error) {
        console.error('创建管理员账户失败:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * 运行所有迁移
 */
export const runMigrations = async () => {
    console.log('=== 开始数据迁移 ===');

    // 1. 迁移匿名用户
    const migrateResult = await migrateAnonymousUsers();

    // 2. 创建管理员账户
    const adminResult = await createAdminUser();

    console.log('=== 数据迁移完成 ===');

    return {
        migrateResult,
        adminResult
    };
};

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigrations()
        .then(() => {
            console.log('迁移完成，退出程序');
            process.exit(0);
        })
        .catch((error) => {
            console.error('迁移失败:', error);
            process.exit(1);
        });
}

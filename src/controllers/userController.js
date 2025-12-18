import { success, error, paginate } from '../utils/response.js';
import { User, Session } from '../models/index.js';
import { validateConstitutionType, validateDiagnosisMethod, validatePagination } from '../utils/validators.js';

/**
 * 获取用户列表（管理员功能）
 */
export const getUsersController = async (ctx) => {
    try {
        const { page = 1, pageSize = 10, userType, keyword } = ctx.query;

        // 验证分页参数
        const paginationValidation = validatePagination({ page, pageSize });
        if (!paginationValidation.isValid) {
            return error(ctx, paginationValidation.errors.join(', '), 4000, 400);
        }

        const { page: validPage, pageSize: validPageSize } = paginationValidation.normalized;

        // 构建查询条件
        const query = {};

        // 按用户类型筛选
        if (userType) {
            query.userType = userType;
        }

        // 关键词搜索（用户名）
        if (keyword) {
            query.username = { $regex: keyword, $options: 'i' };
        }

        // 查询用户列表
        const users = await User.find(query)
            .select('-password') // 排除密码字段
            .sort({ createdAt: -1 })
            .skip((validPage - 1) * validPageSize)
            .limit(validPageSize);

        // 获取总数
        const total = await User.countDocuments(query);

        return paginate(ctx, users, total, validPage, validPageSize, '获取用户列表成功');
    } catch (err) {
        console.error('Get users error:', err);
        return error(ctx, '获取用户列表失败', 5000, 500);
    }
};

/**
 * 获取用户详情
 */
export const getUserByIdController = async (ctx) => {
    try {
        const { id } = ctx.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return error(ctx, '用户不存在', 4003, 404);
        }

        return success(ctx, { user }, '获取用户详情成功');
    } catch (err) {
        console.error('Get user by id error:', err);
        return error(ctx, '获取用户详情失败', 5000, 500);
    }
};

/**
 * 更新用户信息
 */
export const updateUserController = async (ctx) => {
    try {
        const userId = ctx.state.user._id;
        const { username } = ctx.request.body;

        // 检查用户名是否已被其他用户使用
        if (username) {
            const existingUser = await User.findOne({
                username,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return error(ctx, '用户名已被使用', 4001, 400);
            }
        }

        // 更新用户信息
        const updateData = {};
        if (username) updateData.username = username;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        return success(ctx, { user: updatedUser }, '更新用户信息成功');
    } catch (err) {
        console.error('Update user error:', err);
        return error(ctx, '更新用户信息失败', 5000, 500);
    }
};

/**
 * 设置用户体质
 */
export const setConstitutionController = async (ctx) => {
    try {
        const userId = ctx.state.user._id;
        const { type, diagnosisMethod = 'manual' } = ctx.request.body;

        // 验证体质类型
        if (!validateConstitutionType(type)) {
            return error(ctx, '无效的体质类型', 4000, 400);
        }

        // 验证诊断方法
        if (!validateDiagnosisMethod(diagnosisMethod)) {
            return error(ctx, '无效的诊断方法', 4000, 400);
        }

        // 设置体质
        await ctx.state.user.setConstitution(type, diagnosisMethod);

        return success(ctx, null, '设置体质成功');
    } catch (err) {
        console.error('Set constitution error:', err);
        return error(ctx, '设置体质失败', 5000, 500);
    }
};

/**
 * 获取用户的体质信息
 */
export const getConstitutionController = async (ctx) => {
    try {
        const user = ctx.state.user;

        return success(ctx, {
            constitution: user.constitution
        }, '获取体质信息成功');
    } catch (err) {
        console.error('Get constitution error:', err);
        return error(ctx, '获取体质信息失败', 5000, 500);
    }
};

/**
 * 删除用户（管理员功能）
 */
export const deleteUserController = async (ctx) => {
    try {
        const { id } = ctx.params;

        // 检查是否为管理员
        if (ctx.state.user.role !== 'admin') {
            return error(ctx, '权限不足', 4007, 403);
        }

        // 检查用户是否存在
        const user = await User.findById(id);
        if (!user) {
            return error(ctx, '用户不存在', 4003, 404);
        }

        // 防止管理员删除自己
        if (user._id.toString() === ctx.state.user._id.toString()) {
            return error(ctx, '不能删除自己的账号', 4007, 403);
        }

        // 删除用户相关的所有session
        await Session.deleteMany({ userId: user._id });

        // 删除用户
        await User.findByIdAndDelete(id);

        return success(ctx, null, '删除用户成功');
    } catch (err) {
        console.error('Delete user error:', err);
        return error(ctx, '删除用户失败', 5000, 500);
    }
};

/**
 * 升级匿名用户为注册用户
 */
export const upgradeUserController = async (ctx) => {
    try {
        const user = ctx.state.user;
        const { username, password } = ctx.request.body;

        // 检查用户是否已经是注册用户
        if (user.userType !== 'anonymous') {
            return error(ctx, '用户已经是注册用户', 4009, 400);
        }

        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return error(ctx, '用户名已存在', 4001, 400);
        }

        // 更新用户信息
        user.username = username;
        user.password = password;
        user.userType = 'registered';

        await user.save();

        return success(ctx, {
            user: user.toSafeObject()
        }, '升级为注册用户成功');
    } catch (err) {
        console.error('Upgrade user error:', err);
        return error(ctx, '升级用户失败', 5000, 500);
    }
};

/**
 * 获取用户统计信息（管理员功能）
 */
export const getUserStatsController = async (ctx) => {
    try {
        // 检查是否为管理员
        if (ctx.state.user.role !== 'admin') {
            return error(ctx, '权限不足', 4007, 403);
        }

        const stats = await Promise.all([
            User.countDocuments({ userType: 'anonymous' }),
            User.countDocuments({ userType: 'registered' }),
            User.countDocuments({ userType: 'admin' }),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ 'constitution.type': { $ne: null } }),
            Session.countDocuments({ expiresAt: { $gt: new Date() } })
        ]);

        const [anonymousCount, registeredCount, adminUserTypeCount, adminRoleCount, hasConstitutionCount, activeSessionCount] = stats;

        return success(ctx, {
            totalUsers: anonymousCount + registeredCount + adminUserTypeCount,
            anonymousUsers: anonymousCount,
            registeredUsers: registeredCount,
            adminUsers: adminRoleCount,
            usersWithConstitution: hasConstitutionCount,
            activeSessions: activeSessionCount
        }, '获取用户统计信息成功');
    } catch (err) {
        console.error('Get user stats error:', err);
        return error(ctx, '获取用户统计信息失败', 5000, 500);
    }
};

import { User, Session } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import { validateRegistration, validateLogin, validateChangePassword } from '../utils/validators.js';

/**
 * 生成唯一sessionId
 * @returns {string} sessionId
 */
const generateSessionId = () => {
    return uuidv4();
};

/**
 * 生成过期时间
 * @param {number} days - 天数，默认7天
 * @returns {Date} 过期时间
 */
const generateExpirationDate = (days = 7) => {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

/**
 * 用户注册服务
 * @param {Object} registerData - 注册数据
 * @returns {Object} 注册结果
 */
export const register = async (registerData) => {
    try {
        // 验证注册数据
        const validation = validateRegistration(registerData);
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.errors.join(', '),
                code: 4012
            };
        }

        const { username, password } = registerData;

        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return {
                success: false,
                error: '用户名已存在',
                code: 4001
            };
        }

        // 生成新的sessionId
        const sessionId = generateSessionId();

        // 创建新用户
        const newUser = new User({
            username,
            password, // 明文存储
            userType: 'registered',
            role: 'user',
            sessionId,
            loginCount: 0
        });

        await newUser.save();

        // 创建session记录
        const newSession = new Session({
            sessionId,
            userId: newUser._id,
            expiresAt: generateExpirationDate()
        });

        await newSession.save();

        return {
            success: true,
            data: {
                user: newUser.toSafeObject(),
                sessionId
            }
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: '注册失败',
            code: 5000
        };
    }
};

/**
 * 用户登录服务
 * @param {Object} loginData - 登录数据
 * @returns {Object} 登录结果
 */
export const login = async (loginData) => {
    try {
        // 验证登录数据
        const validation = validateLogin(loginData);
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.errors.join(', '),
                code: 4010
            };
        }

        const { username, password } = loginData;

        // 查找用户
        const user = await User.findOne({
            username,
            userType: { $in: ['registered', 'admin'] }
        });

        if (!user) {
            return {
                success: false,
                error: '用户名或密码错误',
                code: 4003
            };
        }

        // 验证密码
        if (!user.verifyPassword(password)) {
            return {
                success: false,
                error: '用户名或密码错误',
                code: 4003
            };
        }

        // 生成新的sessionId（防止Session Fixation）
        const newSessionId = generateSessionId();

        // 删除旧session（如果存在）
        await Session.deleteMany({ userId: user._id });

        // 创建新session
        const newSession = new Session({
            sessionId: newSessionId,
            userId: user._id,
            expiresAt: generateExpirationDate()
        });

        await newSession.save();

        // 更新用户的sessionId和登录信息
        user.sessionId = newSessionId;
        await user.updateLoginInfo();

        return {
            success: true,
            data: {
                user: user.toSafeObject(),
                sessionId: newSessionId
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: '登录失败',
            code: 5000
        };
    }
};

/**
 * 用户登出服务
 * @param {string} sessionId - 会话ID
 * @returns {Object} 登出结果
 */
export const logout = async (sessionId) => {
    try {
        if (!sessionId) {
            return {
                success: false,
                error: '未提供会话ID',
                code: 4006
            };
        }

        // 删除session记录
        const result = await Session.deleteOne({ sessionId });

        if (result.deletedCount === 0) {
            return {
                success: false,
                error: '会话不存在或已过期',
                code: 4005
            };
        }

        return {
            success: true,
            data: null
        };
    } catch (error) {
        console.error('Logout error:', error);
        return {
            success: false,
            error: '登出失败',
            code: 5000
        };
    }
};

/**
 * 修改密码服务
 * @param {string} userId - 用户ID
 * @param {Object} passwordData - 密码数据
 * @returns {Object} 修改结果
 */
export const changePassword = async (userId, passwordData) => {
    try {
        // 验证密码数据
        const validation = validateChangePassword(passwordData);
        if (!validation.isValid) {
            return {
                success: false,
                error: validation.errors.join(', '),
                code: 4012
            };
        }

        const { currentPassword, newPassword } = passwordData;

        // 查找用户
        const user = await User.findById(userId);
        if (!user) {
            return {
                success: false,
                error: '用户不存在',
                code: 4003
            };
        }

        // 验证当前密码
        if (!user.verifyPassword(currentPassword)) {
            return {
                success: false,
                error: '当前密码错误',
                code: 4008
            };
        }

        // 更新密码
        user.password = newPassword;
        await user.save();

        // 删除所有session（强制重新登录）
        await Session.deleteMany({ userId: user._id });

        return {
            success: true,
            data: null
        };
    } catch (error) {
        console.error('Change password error:', error);
        return {
            success: false,
            error: '修改密码失败',
            code: 5000
        };
    }
};

/**
 * 获取当前用户信息服务
 * @param {string} sessionId - 会话ID
 * @returns {Object} 用户信息
 */
export const getCurrentUser = async (sessionId) => {
    try {
        if (!sessionId) {
            return {
                success: false,
                error: '未提供会话ID',
                code: 4006
            };
        }

        // 查找session和用户
        const session = await Session.findOne({
            sessionId,
            expiresAt: { $gt: new Date() }
        }).populate('userId');

        if (!session) {
            return {
                success: false,
                error: '会话已过期',
                code: 4005
            };
        }

        return {
            success: true,
            data: {
                user: session.userId.toSafeObject()
            }
        };
    } catch (error) {
        console.error('Get current user error:', error);
        return {
            success: false,
            error: '获取用户信息失败',
            code: 5000
        };
    }
};

/**
 * 刷新过期时间服务
 * @param {string} sessionId - 会话ID
 * @returns {Object} 刷新结果
 */
export const refreshSession = async (sessionId) => {
    try {
        const session = await Session.findOne({ sessionId });
        if (!session) {
            return {
                success: false,
                error: '会话不存在',
                code: 4005
            };
        }

        await session.extendExpiration();

        return {
            success: true,
            data: {
                expiresAt: session.expiresAt
            }
        };
    } catch (error) {
        console.error('Refresh session error:', error);
        return {
            success: false,
            error: '刷新会话失败',
            code: 5000
        };
    }
};

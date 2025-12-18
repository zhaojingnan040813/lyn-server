import { validatePasswordFormat, validateUsernameFormat, isWeakPassword } from './password.js';

/**
 * 验证用户注册数据
 * @param {Object} data - 注册数据
 * @returns {Object} 验证结果 { isValid: boolean, errors: string[] }
 */
export const validateRegistration = (data) => {
    const errors = [];

    // 验证用户名
    if (!data.username) {
        errors.push('用户名不能为空');
    } else if (!validateUsernameFormat(data.username)) {
        errors.push('用户名格式错误：3-20位，只能包含字母、数字、下划线');
    }

    // 验证密码
    if (!data.password) {
        errors.push('密码不能为空');
    } else if (!validatePasswordFormat(data.password)) {
        errors.push('密码格式错误：至少6位字符');
    } else if (isWeakPassword(data.password)) {
        errors.push('密码过于简单，请使用更复杂的密码');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * 验证用户登录数据
 * @param {Object} data - 登录数据
 * @returns {Object} 验证结果 { isValid: boolean, errors: string[] }
 */
export const validateLogin = (data) => {
    const errors = [];

    if (!data.username) {
        errors.push('用户名不能为空');
    }

    if (!data.password) {
        errors.push('密码不能为空');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * 验证修改密码数据
 * @param {Object} data - 修改密码数据
 * @returns {Object} 验证结果 { isValid: boolean, errors: string[] }
 */
export const validateChangePassword = (data) => {
    const errors = [];

    if (!data.currentPassword) {
        errors.push('当前密码不能为空');
    }

    if (!data.newPassword) {
        errors.push('新密码不能为空');
    } else if (!validatePasswordFormat(data.newPassword)) {
        errors.push('新密码格式错误：至少6位字符');
    } else if (data.currentPassword === data.newPassword) {
        errors.push('新密码不能与当前密码相同');
    } else if (isWeakPassword(data.newPassword)) {
        errors.push('新密码过于简单，请使用更复杂的密码');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * 验证体质类型
 * @param {string} type - 体质类型
 * @returns {boolean} 是否有效
 */
export const validateConstitutionType = (type) => {
    const validTypes = [
        'balanced', 'qi_deficiency', 'yang_deficiency', 'yin_deficiency',
        'phlegm_dampness', 'damp_heat', 'blood_stasis', 'qi_stagnation', 'special'
    ];
    return validTypes.includes(type);
};

/**
 * 验证诊断方法
 * @param {string} method - 诊断方法
 * @returns {boolean} 是否有效
 */
export const validateDiagnosisMethod = (method) => {
    const validMethods = ['manual', 'ai'];
    return validMethods.includes(method);
};

/**
 * 验证分页参数
 * @param {Object} data - 分页数据
 * @returns {Object} 验证结果 { isValid: boolean, errors: string[], normalized: Object }
 */
export const validatePagination = (data) => {
    const errors = [];
    const normalized = {
        page: 1,
        pageSize: 10
    };

    // 验证页码
    if (data.page !== undefined) {
        const page = parseInt(data.page, 10);
        if (isNaN(page) || page < 1) {
            errors.push('页码必须是大于0的整数');
        } else {
            normalized.page = page;
        }
    }

    // 验证每页数量
    if (data.pageSize !== undefined) {
        const pageSize = parseInt(data.pageSize, 10);
        if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
            errors.push('每页数量必须是1-100之间的整数');
        } else {
            normalized.pageSize = pageSize;
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        normalized
    };
};

/**
 * 清理和验证用户输入
 * @param {string} input - 用户输入
 * @param {Object} options - 清理选项
 * @returns {string} 清理后的字符串
 */
export const sanitizeInput = (input, options = {}) => {
    if (typeof input !== 'string') {
        return '';
    }

    let cleaned = input.trim();

    // 移除潜在的XSS攻击字符
    if (options.removeXSS) {
        cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
        cleaned = cleaned.replace(/javascript:/gi, '');
        cleaned = cleaned.replace(/on\w+\s*=/gi, '');
    }

    // 限制长度
    if (options.maxLength && cleaned.length > options.maxLength) {
        cleaned = cleaned.substring(0, options.maxLength);
    }

    return cleaned;
};

/**
 * 验证邮箱格式（备用）
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * 验证手机号格式（备用）
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export const validatePhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
};

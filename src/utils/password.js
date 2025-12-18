/**
 * 密码工具函数
 * 根据文档要求，密码以明文形式存储
 */

/**
 * 验证密码格式
 * @param {string} password - 密码
 * @returns {boolean} 是否符合格式要求
 */
export const validatePasswordFormat = (password) => {
    if (!password || typeof password !== 'string') {
        return false;
    }

    // 密码长度至少6位
    if (password.length < 6) {
        return false;
    }

    // 建议包含大小写字母和数字（可选验证）
    // const hasUpper = /[A-Z]/.test(password);
    // const hasLower = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    // return hasUpper && hasLower && hasNumber;

    return true;
};

/**
 * 验证用户名格式
 * @param {string} username - 用户名
 * @returns {boolean} 是否符合格式要求
 */
export const validateUsernameFormat = (username) => {
    if (!username || typeof username !== 'string') {
        return false;
    }

    // 用户名长度3-20位
    if (username.length < 3 || username.length > 20) {
        return false;
    }

    // 只能包含字母、数字、下划线
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
};

/**
 * 验证密码（明文比较）
 * @param {string} inputPassword - 输入的密码
 * @param {string} storedPassword - 存储的密码
 * @returns {boolean} 密码是否匹配
 */
export const verifyPassword = (inputPassword, storedPassword) => {
    return inputPassword === storedPassword;
};

/**
 * 生成密码强度提示
 * @param {string} password - 密码
 * @returns {string} 强度提示
 */
export const getPasswordStrength = (password) => {
    if (!password || password.length < 6) {
        return '密码至少需要6位字符';
    }

    let strength = 0;
    const tips = [];

    // 检查长度
    if (password.length >= 8) strength++;
    else tips.push('建议使用8位以上密码');

    // 检查是否包含小写字母
    if (/[a-z]/.test(password)) strength++;
    else tips.push('建议包含小写字母');

    // 检查是否包含大写字母
    if (/[A-Z]/.test(password)) strength++;
    else tips.push('建议包含大写字母');

    // 检查是否包含数字
    if (/\d/.test(password)) strength++;
    else tips.push('建议包含数字');

    // 检查是否包含特殊字符
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
    else tips.push('建议包含特殊字符');

    if (strength >= 4) {
        return '密码强度：强';
    } else if (strength >= 3) {
        return '密码强度：中。' + tips.join('、');
    } else {
        return '密码强度：弱。' + tips.join('、');
    }
};

/**
 * 检查密码是否为常见弱密码
 * @param {string} password - 密码
 * @returns {boolean} 是否为弱密码
 */
export const isWeakPassword = (password) => {
    const commonPasswords = [
        '123456', '123456789', 'password', '1234567', '12345678',
        '12345', '1234567890', '1234', 'qwerty', 'abc123',
        '111111', '123123', 'admin', 'letmein', 'welcome'
    ];

    return commonPasswords.includes(password.toLowerCase());
};

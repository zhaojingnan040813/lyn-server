import Joi from 'joi';
import { error } from '../utils/response.js';

/**
 * 创建验证中间件
 * @param {Object} schema - Joi验证模式
 * @param {string} source - 验证数据源 ('body', 'query', 'params')
 */
export const validate = (schema, source = 'body') => {
    return async (ctx, next) => {
        try {
            const data = ctx[source];
            const { error: validationError } = schema.validate(data);

            if (validationError) {
                const errorMessage = validationError.details[0].message;
                return error(ctx, errorMessage, 4000, 400);
            }

            await next();
        } catch (err) {
            return error(ctx, '数据验证失败', 4000, 400);
        }
    };
};

// 用户注册验证模式
export const registerSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.alphanum': '用户名只能包含字母和数字',
            'string.min': '用户名至少3个字符',
            'string.max': '用户名最多20个字符',
            'any.required': '用户名不能为空'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': '密码至少6个字符',
            'any.required': '密码不能为空'
        })
});

// 用户登录验证模式
export const loginSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'any.required': '用户名不能为空'
        }),
    password: Joi.string()
        .required()
        .messages({
            'any.required': '密码不能为空'
        })
});

// 修改密码验证模式
export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'any.required': '当前密码不能为空'
        }),
    newPassword: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': '新密码至少6个字符',
            'any.required': '新密码不能为空'
        })
});

// 用户信息更新验证模式
export const updateProfileSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .optional()
        .messages({
            'string.alphanum': '用户名只能包含字母和数字',
            'string.min': '用户名至少3个字符',
            'string.max': '用户名最多20个字符'
        })
});

// 体质设置验证模式
export const constitutionSchema = Joi.object({
    type: Joi.string()
        .valid('balanced', 'qi_deficiency', 'yang_deficiency', 'yin_deficiency',
            'phlegm_dampness', 'damp_heat', 'blood_stasis', 'qi_stagnation', 'special')
        .required()
        .messages({
            'any.only': '无效的体质类型',
            'any.required': '体质类型不能为空'
        }),
    diagnosisMethod: Joi.string()
        .valid('manual', 'ai')
        .default('manual')
        .messages({
            'any.only': '诊断方式只能是manual或ai'
        })
});

// 分页参数验证模式
export const paginationSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.integer': '页码必须是整数',
            'number.min': '页码最小为1'
        }),
    pageSize: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.integer': '每页数量必须是整数',
            'number.min': '每页数量最小为1',
            'number.max': '每页数量最大为100'
        })
});

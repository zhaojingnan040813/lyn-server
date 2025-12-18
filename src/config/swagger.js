import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '智能体质膳食推荐系统 API',
            version: '1.0.0',
            description: '基于中医体质理论的智能膳食推荐系统API文档',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: '开发服务器'
            }
        ],
        tags: [
            {
                name: 'Auth',
                description: '用户认证管理'
            },
            {
                name: 'User',
                description: '用户管理'
            },
            {
                name: 'Session',
                description: '用户会话管理'
            },
            {
                name: 'Constitution',
                description: '体质类型管理'
            },
            {
                name: 'Preference',
                description: '用户偏好设置'
            },
            {
                name: 'Recipe',
                description: '菜谱推荐'
            },
            {
                name: 'Ingredient',
                description: '食材管理'
            }
        ],
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'integer',
                            description: '错误码'
                        },
                        message: {
                            type: 'string',
                            description: '错误信息'
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        code: {
                            type: 'integer',
                            example: 0
                        },
                        message: {
                            type: 'string',
                            example: 'success'
                        },
                        data: {
                            type: 'object'
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: '用户ID'
                        },
                        username: {
                            type: 'string',
                            description: '用户名'
                        },
                        userType: {
                            type: 'string',
                            enum: ['anonymous', 'registered', 'admin'],
                            description: '用户类型'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: '用户角色'
                        },
                        sessionId: {
                            type: 'string',
                            description: '会话ID'
                        },
                        constitution: {
                            $ref: '#/components/schemas/Constitution'
                        },
                        lastLoginAt: {
                            type: 'string',
                            format: 'date-time',
                            description: '最后登录时间'
                        },
                        loginCount: {
                            type: 'integer',
                            description: '登录次数'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: '创建时间'
                        },
                        lastActiveAt: {
                            type: 'string',
                            format: 'date-time',
                            description: '最后活跃时间'
                        }
                    }
                },
                Constitution: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: ['balanced', 'qi_deficiency', 'yang_deficiency', 'yin_deficiency', 'phlegm_dampness', 'damp_heat', 'blood_stasis', 'qi_stagnation', 'special'],
                            description: '体质类型'
                        },
                        diagnosisMethod: {
                            type: 'string',
                            enum: ['manual', 'ai'],
                            description: '诊断方式'
                        },
                        diagnosedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: '诊断时间'
                        }
                    }
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'integer',
                            description: '总记录数'
                        },
                        page: {
                            type: 'integer',
                            description: '当前页码'
                        },
                        pageSize: {
                            type: 'integer',
                            description: '每页数量'
                        },
                        totalPages: {
                            type: 'integer',
                            description: '总页数'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

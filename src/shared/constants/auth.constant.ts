export const AUTH_CONSTANTS = {
    OTP_EXPIRES_IN: 5 * 60 * 1000, // 5 phút (đơn vị: milliseconds)
    ACCESS_TOKEN_EXPIRES_IN: '15m',
    REFRESH_TOKEN_EXPIRES_IN: '7d',
} as const;

export const AuthType = {
    AccessToken: 'AccessToken',
    ApiKey: 'ApiKey',
    None: 'None',
} as const;

export type AuthType = (typeof AuthType)[keyof typeof AuthType];

export const ConditionGuard = {
    And: 'and',
    Or: 'or',
} as const;

export type ConditionGuard = (typeof ConditionGuard)[keyof typeof ConditionGuard];
import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../constants/auth.constant';

export const AUTH_TYPE_KEY = 'authType';

export const Auth = (
    ...authTypes: AuthType[]
) => {
    return SetMetadata(
        AUTH_TYPE_KEY,
        authTypes.length > 0
            ? authTypes
            : [AuthType.AccessToken],
    );
};
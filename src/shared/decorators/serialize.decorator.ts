import { instanceToPlain } from 'class-transformer';
import { UserModel } from '../models/share-user.model';

export function Serialize() {
    return function (
        target: any,
        propertyName: string,
        descriptor: PropertyDescriptor,
    ) {
        const method = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const result = await method.apply(this, args);

            if (result === null || result === undefined) {
                return result;
            }

            // Nếu result có field `data`, chỉ serialize phần data
            if (result.data) {
                return {
                    ...result,
                    data: instanceToPlain(
                        new UserModel(result.data),
                    ),
                };
            }

            return instanceToPlain(new UserModel(result));
        };

        return descriptor;
    };
}
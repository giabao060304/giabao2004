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

            return JSON.parse(JSON.stringify(result));
        };

        return descriptor;
    };
}
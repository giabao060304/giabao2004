import * as Joi from 'joi';

export default () => ({
    port: Number(process.env.PORT),
    database: {
        url: process.env.DATABASE_URL,
    },
});

export const validationSchema = Joi.object({
    DATABASE_URL: Joi.string().required(),
    PORT: Joi.number().default(3000),
});
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  DATABASE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  SALT_ROUND: Joi.number().default(10),
  SERVER_DOMAIN: Joi.string().default('http://localhost:3000'),
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  REDIS_PORT: Joi.number().default(6379),
});

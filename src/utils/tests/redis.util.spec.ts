/* eslint-disable @typescript-eslint/no-unused-vars */
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Test, TestingModule } from '@nestjs/testing';

import { RedisUtils } from '@utils/redis.util';

describe('RedisUtils', () => {
  let redisUtils: RedisUtils;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        RedisUtils,
        {
          provide: RedisService,
          useValue: {
            getClient: jest.fn(() => ({
              setex: jest.fn((key, duration, value) => Promise.resolve('OK')),
              get: jest.fn((key: string) => Promise.resolve('OK')),
              del: jest.fn((key: string) => Promise.resolve(1)),
            })),
          },
        },
      ],
    }).compile();

    redisUtils = moduleRef.get<RedisUtils>(RedisUtils);
  });

  describe('Define', () => {
    it('Should define RedisUtils', () => {
      expect(redisUtils).toBeDefined();
    });
  });

  describe('setValue', () => {
    it('Should store value in redis', async () => {
      const result = await redisUtils.setValue('1', 2, 500);
      expect(result).toBe('OK');
    });
  });

  describe('getValue', () => {
    it('Should return the value fetched from redis', async () => {
      const result = await redisUtils.getValue('key');
      expect(result).toBe('OK');
    });
  });

  describe('deleteValue', () => {
    it('Should delete the value from redis', async () => {
      const result = await redisUtils.deleteValue('key');
      expect(result).toBe(1);
    });
  });
});

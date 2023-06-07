import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { RedisUtils } from '@utils/redis.util';
import { JwtHelper } from '@utils/jwt.util';
import { RedisUtilsMock } from '@utils/tests/mocks/redis.util.mock';
import { ConfigServiceMock } from '@modules/auth/tests/mocks/config.service.mock';

describe('JwtHelper', () => {
  let jwtService: JwtService;
  let redisUtils: RedisUtils;
  let configService: ConfigService;
  let jwtHelper: JwtHelper;

  beforeEach(async () => {
    const modulesRef: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        JwtHelper,
        JwtService,
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
        {
          provide: RedisUtils,
          useClass: RedisUtilsMock,
        },
      ],
    }).compile();

    jwtService = modulesRef.get<JwtService>(JwtService);
    redisUtils = modulesRef.get<RedisUtils>(RedisUtils);
    jwtHelper = modulesRef.get<JwtHelper>(JwtHelper);
    configService = modulesRef.get<ConfigService>(ConfigService);
  });

  describe('Define', () => {
    it('Should define all dependencies', () => {
      expect(jwtHelper).toBeDefined();
      expect(jwtService).toBeDefined();
      expect(redisUtils).toBeDefined();
      expect(configService).toBeDefined();
    });
  });

  describe('signAccessToken', () => {
    it('Should sign token', async () => {
      const result = await jwtHelper.signAccessToken(
        { id: '1' },
        { expiresIn: '1h', secret: 'secret' },
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveLength(0);
    });
  });

  describe('signRefreshToken', () => {
    it('Should sign refresh token', async () => {
      const result = await jwtHelper.signRefreshToken(
        { userId: '1' },
        { expiresIn: '1h', secret: 'secret' },
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveLength(0);
    });
  });

  describe('verifyToken', () => {
    it('Should verify token', async () => {
      const result = await jwtHelper.verifyToken(
        await jwtHelper.signAccessToken(
          { userId: 1 },
          { secret: 'secret', expiresIn: '1h' },
        ),
        { secret: 'secret' },
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('userId', 1);
    });
  });
});

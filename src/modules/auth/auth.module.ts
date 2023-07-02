import { Module } from '@nestjs/common';

import { UtilsModule } from '@utils/util.module';
import { UserModule } from '@modules/user/user.module';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/modules/auth/strategies/local.strategy';

@Module({
  imports: [UserModule, UtilsModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@modules/user/user.entity';
import { PostModule } from '@modules/post/post.module';
import { UserService } from '@modules/user/user.service';
import { UserRepository } from '@modules/user/user.repository';
import { UserController } from '@modules/user/user.controller';
import { CommentModule } from '@modules/comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PostModule, CommentModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

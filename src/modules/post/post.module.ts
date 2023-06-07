import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@modules/post/post.entity';
import { PostService } from '@modules/post/post.service';
import { PostRepository } from '@modules/post/post.repository';
import { PostController } from '@modules/post/post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}

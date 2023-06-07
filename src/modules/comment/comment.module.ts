import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostModule } from '@modules/post/post.module';
import { Comment } from '@modules/comment/comment.entity';
import { CommentService } from '@/modules/comment/comment.service';
import { CommentRepository } from '@/modules/comment/comment.repository';
import { CommentController } from '@/modules/comment/comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService],
})
export class CommentModule {}

import {
  Get,
  Body,
  Post,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Comment } from '@modules/comment/comment.entity';
import { CommentDto } from '@modules/comment/dtos/comment.dto';
import { Serialize } from '@interceptors/serialize.interceptor';
import { CurrentUser } from '@decorators/current-user.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { CommentService } from '@/modules/comment/comment.service';
import { TCurrentUser } from '@modules/user/typings/current-user.type';
import { CreateCommentDto } from '@modules/comment/dtos/create-comment.dto';
import { ApiSuccessResponseDto } from '@common/api-responses/ApiSuccessResponseDto';
import { ApiNotFoundResponseDto } from '@common/api-responses/ApiNotFoundResponse.dto';
import { ApiUnauthorizedResponseDto } from '@common/api-responses/ApiUnauthorizeResponse.dto';

@UseGuards(JwtAuthGuard)
@Controller('/users/:userId/posts/:postId/comments')
@ApiTags('Comment')
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @Serialize(CommentDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of comments made on a post.',
    type: CommentDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  getCommentsOfPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Array<Comment>> {
    return this.commentService.getCommentsOfPost(userId, postId);
  }

  @Get(':commentId')
  @Serialize(CommentDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiParam({ name: 'commentId', description: 'Id of the comment.' })
  @ApiResponse({
    status: 200,
    description: "Returns the comments made on a post identified by it's id.",
    type: CommentDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  async getCommentById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<Comment> {
    const comment = await this.commentService.getCommentById(
      userId,
      postId,
      commentId,
    );

    if (!comment) {
      throw new NotFoundException(
        `No such comment exists with id: ${commentId}`,
      );
    }

    return comment;
  }

  @Post()
  @HttpCode(200)
  @Serialize(CommentDto)
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the created comment object.',
    type: CommentDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  createComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: TCurrentUser,
  ): Promise<Comment> {
    return this.commentService.createComment(
      user,
      userId,
      postId,
      createCommentDto,
    );
  }

  @Delete(':commentId')
  @ApiParam({ name: 'userId', description: 'Id of the user.' })
  @ApiParam({ name: 'postId', description: 'Id of the post.' })
  @ApiParam({ name: 'commentId', description: 'Id of the comment.' })
  @ApiResponse({
    status: 200,
    description: 'Returns the success response of comment deletion.',
    type: ApiSuccessResponseDto,
  })
  @ApiUnauthorizedResponse({ type: ApiUnauthorizedResponseDto })
  @ApiNotFoundResponse({ type: ApiNotFoundResponseDto })
  deleteComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @CurrentUser() user: TCurrentUser,
  ): Promise<{ message: string }> {
    return this.commentService.deleteComment(user, userId, postId, commentId);
  }
}

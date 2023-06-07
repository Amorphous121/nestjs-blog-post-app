import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

import { PostService } from '@modules/post/post.service';
import { CreatePostDtoStub } from '@modules/post/tests/stubs';
import { CurrentUserDtoStub } from '@/modules/user/tests/stubs';
import { CommentService } from '@modules/comment/comment.service';
import { CreateCommentDtoStub } from '@modules/comment/tests/stubs';
import { TCurrentUser } from '@modules/user/typings/current-user.type';
import { CommentRepository } from '@modules/comment/comment.repository';
import { PostServiceMock } from '@modules/post/tests/mocks/post.service.mock';
import { CommentRepositoryMock } from '@modules/comment/tests/mocks/comment.repository.mock';

describe('CommentService', () => {
  let commentService: CommentService;
  let postService: PostService;

  const currentUser: TCurrentUser = CurrentUserDtoStub();
  const createPostDto = CreatePostDtoStub();

  const createCommentDto = CreateCommentDtoStub();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useClass: CommentRepositoryMock,
        },
        {
          provide: PostService,
          useClass: PostServiceMock,
        },
      ],
    }).compile();

    commentService = moduleRef.get<CommentService>(CommentService);
    postService = moduleRef.get<PostService>(PostService);
  });

  describe('Define', () => {
    it('Should define the commentService', () => {
      expect(commentService).toBeDefined();
      expect(postService).toBeDefined();
    });
  });

  describe('createComment', () => {
    it('Should throw NotFoundException on invalid postId', async () => {
      await expect(
        commentService.createComment(currentUser, 1, 1, createCommentDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        commentService.createComment(currentUser, 1, 1, createCommentDto),
      ).rejects.toThrow(
        new NotFoundException('No such post exists with id : 1'),
      );
    });

    it('Should create comment on given post', async () => {
      await postService.createPost(currentUser, createPostDto);
      const result = await commentService.createComment(
        currentUser,
        1,
        1,
        createCommentDto,
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('getCommentsOfPost', () => {
    it('Should throw NotFoundException', async () => {
      await expect(commentService.getCommentsOfPost(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(commentService.getCommentsOfPost(1, 1)).rejects.toThrow(
        new NotFoundException(`No such post exists with id : 1`),
      );
    });

    it('Should return list of comments', async () => {
      await postService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);

      const result = await commentService.getCommentsOfPost(1, 1);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 1);
    });
  });

  describe('getCommentById', () => {
    it('Should throw NotFoundException', async () => {
      await expect(commentService.getCommentById(1, 2, 3)).rejects.toThrow(
        NotFoundException,
      );
      await expect(commentService.getCommentById(1, 2, 3)).rejects.toThrow(
        new NotFoundException(`No such post exists with id : 2`),
      );
    });

    it('Should return the comment', async () => {
      await postService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);

      const result = await commentService.getCommentById(1, 1, 1);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('text', 'test-comment.');
    });
  });

  describe('deleteComment', () => {
    it('Should throw NotFoundException', async () => {
      await expect(
        commentService.deleteComment(currentUser, 1, 1, 1),
      ).rejects.toThrow(NotFoundException);
      await expect(
        commentService.deleteComment(currentUser, 1, 1, 1),
      ).rejects.toThrow(
        new NotFoundException(`No such comment exists with id : 1`),
      );
    });

    it('Should throw UnauthorizedException', async () => {
      await postService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);

      await expect(
        commentService.deleteComment({ ...currentUser, id: 2 }, 1, 1, 1),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Should delete comment', async () => {
      await postService.createPost(currentUser, createPostDto);
      await commentService.createComment(currentUser, 1, 1, createCommentDto);
      const result = commentService.deleteComment(currentUser, 1, 1, 1);
      expect(result).toBeDefined();
    });
  });
});

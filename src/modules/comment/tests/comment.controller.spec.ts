import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CurrentUserDtoStub } from '@modules/user/tests/stubs';
import { CommentService } from '@modules/comment/comment.service';
import { CreateCommentDtoStub } from '@modules/comment/tests/stubs';
import { CommentController } from '@modules/comment/comment.controller';
import { CommentServiceMock } from '@modules/comment/tests/mocks/comment.service.mock';

describe('CommentsController', () => {
  let commentController: CommentController;
  let commentService: CommentService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [{ provide: CommentService, useClass: CommentServiceMock }],
    }).compile();

    commentController = moduleRef.get<CommentController>(CommentController);
    commentService = moduleRef.get<CommentService>(CommentService);
  });

  describe('Define', () => {
    it('Should define dependencies', () => {
      expect(commentController).toBeDefined();
      expect(commentService).toBeDefined();
    });
  });

  describe('createComment', () => {
    it('Should create comment', async () => {
      const result = await commentController.createComment(
        1,
        1,
        CreateCommentDtoStub(),
        CurrentUserDtoStub(),
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('text', CreateCommentDtoStub().text);
    });
  });

  describe('getCommentsOfPost', () => {
    it('Should return comments of post', async () => {
      await commentController.createComment(
        1,
        1,
        CreateCommentDtoStub(),
        CurrentUserDtoStub(),
      );

      const list = await commentController.getCommentsOfPost(1, 1);
      expect(list).toBeDefined();
      expect(list).toHaveLength(1);
      expect(list[0]).toHaveProperty('id', 1);
    });
  });

  describe('getCommentById', () => {
    it('It should throw NotFoundException', async () => {
      await expect(commentController.getCommentById(1, 1, 1)).rejects.toThrow(
        NotFoundException,
      );
      await expect(commentController.getCommentById(1, 1, 1)).rejects.toThrow(
        new NotFoundException('No such comment exists with id: 1'),
      );
    });
  });

  it('Should return the comment found by id', async () => {
    await commentController.createComment(
      1,
      1,
      CreateCommentDtoStub(),
      CurrentUserDtoStub(),
    );

    const result = await commentController.getCommentById(1, 1, 1);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('text', CreateCommentDtoStub().text);
  });

  describe('deleteComment', () => {
    it('Should delete the given comment', async () => {
      await commentController.createComment(
        1,
        1,
        CreateCommentDtoStub(),
        CurrentUserDtoStub(),
      );

      const result = await commentController.deleteComment(
        1,
        1,
        1,
        CurrentUserDtoStub(),
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('message', 'Comment deleted successfully!');
    });
  });
});

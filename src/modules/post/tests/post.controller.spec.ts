import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
  CreatePostDtoStub,
  UpdatePostDtoStub,
} from '@modules/post/tests/stubs';
import { PostService } from '@modules/post/post.service';
import { PostController } from '@modules/post/post.controller';
import { CurrentUserDtoStub } from '@/modules/user/tests/stubs';
import { PostServiceMock } from '@modules/post/tests/mocks/post.service.mock';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useClass: PostServiceMock,
        },
      ],
    }).compile();
    postController = moduleRef.get<PostController>(PostController);
    postService = moduleRef.get<PostService>(PostService);
  });

  describe('Define', () => {
    it('Should define PostController and dependencies', () => {
      expect(postController).toBeDefined();
      expect(postService).toBeDefined();
    });
  });

  describe('createPost', () => {
    it('Should create post', async () => {
      const result = await postController.createPost(
        1,
        CurrentUserDtoStub(),
        CreatePostDtoStub(),
      );
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('authorId', 1);
      expect(result).toHaveProperty('title', 'Test Title');
      expect(result).toHaveProperty('text', 'Test Text');
    });
  });

  describe('getAllPosts', () => {
    it('Should return the list of posts', async () => {
      await postController.createPost(
        1,
        CurrentUserDtoStub(),
        CreatePostDtoStub(),
      );
      const results = await postController.getAllPosts(1);

      expect(results).toBeDefined();
      expect(results).toHaveLength(1);
      expect(results[0]).toHaveProperty('id', 1);
      expect(results[0]).toHaveProperty('authorId', 1);
      expect(results[0]).toHaveProperty('title', 'Test Title');
      expect(results[0]).toHaveProperty('text', 'Test Text');
    });
  });

  describe('getPostById', () => {
    it('Should throw NotFoundException', async () => {
      await expect(postController.getPostById(1, 1)).rejects.toThrow(
        NotFoundException,
      );

      await expect(postController.getPostById(1, 1)).rejects.toThrow(
        new NotFoundException(`No such post found with id : 1`),
      );
    });

    it('Should return the post identified by id', async () => {
      await postController.createPost(
        1,
        CurrentUserDtoStub(),
        CreatePostDtoStub(),
      );

      const result = await postController.getPostById(1, 1);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('authorId', 1);
      expect(result).toHaveProperty('title', 'Test Title');
      expect(result).toHaveProperty('text', 'Test Text');
    });
  });

  describe('updatePost', () => {
    it('Should update the post', async () => {
      await postController.createPost(
        1,
        CurrentUserDtoStub(),
        CreatePostDtoStub(),
      );
      const result = await postController.updatePost(
        1,
        1,
        UpdatePostDtoStub(),
        CurrentUserDtoStub(),
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('authorId', 1);
      expect(result).toHaveProperty('title', 'Updated Title');
      expect(result).toHaveProperty('text', 'UpdatedText');
    });
  });

  describe('deletePost', () => {
    it('Should delete the post', async () => {
      const result = await postController.deletePost(
        1,
        1,
        CurrentUserDtoStub(),
      );

      expect(result).toBeDefined();
      expect(result).toHaveProperty('message', 'Post deleted successfully.');
    });
  });
});

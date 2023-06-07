import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { CommentRepository } from '@modules/comment/comment.repository';

describe('CommentRepository', () => {
  let repository: CommentRepository;
  const dataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CommentRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<CommentRepository>(CommentRepository);
  });

  describe('Define', () => {
    it('Should define the CommentRepository', () => {
      expect(repository).toBeDefined();
    });
  });
});

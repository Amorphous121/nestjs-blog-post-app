import { CreateCommentDto } from '@modules/comment/dtos/create-comment.dto';

export const CreateCommentDtoStub = (
  createCommentDto: CreateCommentDto | Record<string, any> = {},
): CreateCommentDto => {
  return {
    text: 'test-comment.',
    ...createCommentDto,
  };
};

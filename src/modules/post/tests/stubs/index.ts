import { CreatePostDto } from '@modules/post/dtos/create-post.dto';
import { UpdatePostDto } from '@modules/post/dtos/update-post.dto';

export const CreatePostDtoStub = (): CreatePostDto => {
  return {
    text: 'Test Text',
    title: 'Test Title',
  };
};

export const UpdatePostDtoStub = (): UpdatePostDto => {
  return {
    title: 'Updated Title',
    text: 'UpdatedText',
  };
};

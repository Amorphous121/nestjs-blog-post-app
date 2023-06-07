import { Comment } from '@modules/comment/comment.entity';
import { TCurrentUser } from '@/modules/user/typings/current-user.type';
import { CreateCommentDto } from '@modules/comment/dtos/create-comment.dto';

export class CommentServiceMock {
  comments: Comment[] = [];

  async createComment(
    currentUser: TCurrentUser,
    userId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const comment = new Comment({
      id: 1,
      postId,
      userId: currentUser.id,
      ...createCommentDto,
    });

    this.comments.push(comment);
    return comment;
  }

  async getCommentsOfPost(userId: number, postId: number) {
    return this.comments.filter(
      (comment) => comment.userId === userId && comment.postId === postId,
    );
  }

  async getCommentById(userId: number, postId: number, commentId: number) {
    return this.comments.find(
      (comment) =>
        comment.userId === userId &&
        comment.postId === postId &&
        comment.id === commentId,
    );
  }

  async deleteComment(): Promise<{ message: string }> {
    return { message: 'Comment deleted successfully!' };
  }
}

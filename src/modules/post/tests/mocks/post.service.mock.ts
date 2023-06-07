/* eslint-disable @typescript-eslint/no-unused-vars */
import { Post } from '@modules/post/post.entity';
import { CreatePostDto } from '@modules/post/dtos/create-post.dto';
import { UpdatePostDto } from '@modules/post/dtos/update-post.dto';
import { TCurrentUser } from '@modules/user/typings/current-user.type';

export class PostServiceMock {
  posts: Post[] = [];

  createPost(currentUser: TCurrentUser, createPostDto: CreatePostDto): Post {
    const post = new Post({
      id: 1,
      ...createPostDto,
      authorId: currentUser.id,
      author: currentUser,
    });
    this.posts.push(post);
    return post;
  }

  async fetchPostOfUserById(userId: number, postId: number): Promise<Post> {
    return this.posts.find(
      (post) => post.id === postId && post.authorId === userId,
    );
  }

  async fetchPostOfUser(userId: number): Promise<Array<Post>> {
    return this.posts.filter((post) => post.authorId === userId);
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    this.posts = this.posts.map((post) =>
      post.id === postId ? { ...post, ...updatePostDto } : post,
    );
    return this.posts.find((post) => post.id === postId);
  }

  async deletePost(
    currentUser: TCurrentUser,
    userId: number,
    postId: number,
  ): Promise<{ message: string }> {
    return {
      message: 'Post deleted successfully.',
    };
  }
}

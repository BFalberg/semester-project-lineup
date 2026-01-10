import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, NotFoundException } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post as PostEntity } from "./entities/post.entity";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request & { user: { id: string } }) {
    try {
      const userId = req.user.id;
      const data = await this.postsService.create(createPostDto, userId);
      return {
        success: true,
        data,
        message: "Post created successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Get()
  async findAll(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      const userId = req.user.id;
      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 10;
      const { data } = await this.postsService.findAll(pageNum, limitNum, userId);
      return {
        success: true,
        data,
        message: "Posts retrieved successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request & { user: { id: string } }) {
    try {
      const userId = req.user.id;
      const data = (await this.postsService.findOne(id, userId)) as PostEntity | null;
      if (!data) {
        throw new NotFoundException("Post not found");
      }
      return {
        success: true,
        data,
        message: "Post retrieved successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request & { user: { id: string } }) {
    try {
      const userId = req.user.id;
      const post = (await this.postsService.findOne(id, userId)) as PostEntity | null;
      if (!post) {
        throw new Error("Post not found");
      }
      if (post.user.id !== userId) {
        throw new Error("You are not authorized to update this post");
      }
      const data = await this.postsService.update(id, updatePostDto);
      return {
        success: true,
        data,
        message: "Post updated successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req: Request & { user: { id: string } }) {
    try {
      const userId = req.user.id;
      const post = (await this.postsService.findOne(id, userId)) as PostEntity | null;
      if (!post) {
        throw new Error("Post not found");
      }
      if (post.user.id !== userId) {
        throw new Error("You are not authorized to delete this post");
      }
      const data = await this.postsService.remove(id);
      return {
        success: true,
        data: {
          title: data.title,
        },
        message: "Post deleted successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Get(":id/likes")
  async getLikes(@Param("id") id: string) {
    try {
      const data = await this.postsService.getLikes(id);
      return {
        success: true,
        totalLiks: data.length,
        data,
        message: "Post likes retrieved successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Post(":id/likes")
  async addLike(@Param("id") id: string, @Req() req: Request & { user: { id: string } }) {
    try {
      const userId = req.user.id;
      const post = (await this.postsService.findOne(id, userId)) as PostEntity | null;
      if (!post) {
        throw new Error("Post not found");
      }
      const data = await this.postsService.addLike(id, userId);
      // Fetch updated total likes
      const likes = await this.postsService.getLikes(id);
      return {
        success: true,
        totalLikes: likes.length,
        data,
        message: "Like added successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Delete(":id/likes")
  async removeLike(@Param("id") id: string, @Req() req: Request & { user: { id: string } }) {
    try {
      const userId = req.user.id;
      const post = (await this.postsService.findOne(id, userId)) as PostEntity | null;
      if (!post) {
        throw new Error("Post not found");
      }
      const data = await this.postsService.removeLike(id, userId);
      const likes = await this.postsService.getLikes(id);
      return {
        success: true,
        totalLikes: likes.length,
        data,
        message: "Like removed successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }

  @Post(":id/comments")
  async addComment(
    @Param("id") id: string,
    @Body("content") content: string,
    @Body("parentId") parentId: string | undefined,
    @Req() req: Request & { user: { id: string } }
  ) {
    try {
      const userId = req.user.id;
      const post = (await this.postsService.findOne(id, userId)) as PostEntity | null;
      if (!post) {
        throw new Error("Post not found");
      }
      if (parentId) {
        const parentComment = await this.postsService.findCommentById(parentId);
        if (!parentComment) {
          throw new Error("Parent comment not found");
        }
        if (parentComment.post.id !== id) {
          throw new Error("Parent comment does not belong to this post");
        }
      }
      const data = await this.postsService.addComment(id, userId, content, parentId);
      const comments = (await this.postsService.findOne(id, userId)) as PostEntity | null;
      return {
        success: true,
        totalComments: comments && Array.isArray(comments.comments) ? comments.comments.length : 0,
        data,
        message: "Comment added successfully",
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        message,
      };
    }
  }
}

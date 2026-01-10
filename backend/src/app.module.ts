import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entities/user.entity";
import { PostsModule } from "./posts/posts.module";
import { Post } from "./posts/entities/post.entity";
import { ThreadsModule } from "./threads/threads.module";
import { Thread } from "./threads/entities/thread.entity";
import { MessagesModule } from "./messages/messages.module";
import { Message } from "./messages/entities/message.entity";
import { NotificationsModule } from "./notifications/notifications.module";
import { Notification } from "./notifications/entities/notification.entity";
import { ReviewsModule } from "./reviews/reviews.module";
import { Review } from "./reviews/entities/review.entity";
import { FavoritesModule } from "./favorites/favorites.module";
import { Favorite } from "./favorites/entities/favorite.entity";
import { ServicesModule } from "./services/services.module";
import { Service } from "./services/entities/service.entity";
import { TagsModule } from "./tags/tags.module";
import { Tag } from "./tags/entities/tag.entity";
import { StoriesModule } from "./stories/stories.module";
import { Story } from "./stories/entities/story.entity";
import { CollaborationsModule } from "./collaborations/collaborations.module";
import { Collaboration } from "./collaborations/entities/collaboration.entity";
import { GenresModule } from "./genres/genres.module";
import { Genre } from "./genres/entities/genre.entity";
import { QuestionsModule } from "./questions/questions.module";
import { Question } from "./questions/entities/question.entity";
import { CommentsModule } from "./comments/comments.module";
import { Comment } from "./comments/entities/comment.entity";
import { LikesModule } from "./likes/likes.module";
import { Like } from "./likes/entities/like.entity";
import { SearchModule } from "./search/search.module";
import { AuthModule } from "./auth/auth.module";
import { SkillsModule } from "./skills/skills.module";
import { Skill } from "./skills/entities/skill.entity";
import { ConnectionsModule } from "./connections/connections.module";
import { Connection } from "./connections/entities/connection.entity";
import { UploadthingModule } from "./uploadthing/uploadthing.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "../db.sqlite",
      entities: [
        User,
        Post,
        Thread,
        Message,
        Notification,
        Review,
        Favorite,
        Service,
        Tag,
        Story,
        Collaboration,
        Genre,
        Question,
        Comment,
        Like,
        Skill,
        Connection,
      ],
      synchronize: true,
    }),
    UsersModule,
    PostsModule,
    ThreadsModule,
    MessagesModule,
    NotificationsModule,
    ReviewsModule,
    FavoritesModule,
    ServicesModule,
    TagsModule,
    StoriesModule,
    CollaborationsModule,
    GenresModule,
    QuestionsModule,
    CommentsModule,
    LikesModule,
    SearchModule,
    AuthModule,
    SkillsModule,
    ConnectionsModule,
    UploadthingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Tag } from "../../tags/entities/tag.entity";
import { Comment } from "../../comments/entities/comment.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ charset: "utf8mb4" })
  content: string;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({ name: "posts_tags" })
  tags: Tag[];

  @Column()
  media: string;

  // Foreign key to User entity
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: "post_users" })
  users: User[];
}

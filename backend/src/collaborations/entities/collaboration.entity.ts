import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Genre } from "../../genres/entities/genre.entity";
import { Tag } from "../../tags/entities/tag.entity";
import { Skill } from "../../skills/entities/skill.entity";

@Entity()
export class Collaboration {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  media: string;

  @Column({ charset: "utf8mb4" })
  title: string;

  @Column({ charset: "utf8mb4" })
  content: string;

  @Column("text")
  role: string;

  @ManyToMany(() => Genre, { eager: true })
  @JoinTable({ name: "collaboration_genres" })
  genres: Genre[];

  @Column({ default: false })
  paid: boolean;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  created: Date;

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable({ name: "collaboration_tags" })
  tags: Tag[];

  @ManyToMany(() => Skill, { eager: true })
  @JoinTable({ name: "collaboration_skills" })
  skills: Skill[];

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: "collaboration_users" })
  users: User[];
}

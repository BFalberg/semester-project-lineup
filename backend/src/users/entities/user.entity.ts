import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { Post } from "../../posts/entities/post.entity";
import { Connection } from "../../connections/entities/connection.entity";
import { Collaboration } from "../../collaborations/entities/collaboration.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  year_of_birth: number;

  @Column({ default: "Jeg mangler at skrive min bio." })
  bio: string;

  @Column({ default: "Her skriver jeg noget om mig selv." })
  about: string;

  @Column()
  location: string;

  @Column({ default: "header-bg-1" })
  theme: string;

  @Column({ type: "varchar", nullable: true, default: null })
  instagram: string | null;

  @Column({ type: "varchar", nullable: true, default: null })
  twitter: string | null;

  @Column({ type: "varchar", nullable: true, default: null })
  facebook: string | null;

  @Column({ type: "varchar", nullable: true, default: null })
  youtube: string | null;

  @Column({ type: "varchar", nullable: true, default: null })
  tiktok: string | null;

  @Column({ type: "varchar", nullable: true, default: null })
  spotify_embed_link: string | null;

  @Column("simple-array")
  videos: string[];

  @Column("simple-array")
  looking_for: string[];

  @Column({ nullable: true, default: null })
  subscription: string;

  @Column({ nullable: true, default: null })
  user_type: string;

  @Column("simple-array", { nullable: true, default: null })
  genres: string[];

  @Column()
  profile_image: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Connection, (conn) => conn.requester)
  connections_sent: Connection[];

  @OneToMany(() => Connection, (conn) => conn.addressee)
  connections_received: Connection[];

  @ManyToMany(() => Collaboration, (collab) => collab.users)
  collaborations: Collaboration[];
}

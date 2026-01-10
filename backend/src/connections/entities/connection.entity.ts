import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export type ConnectionStatus = "pending" | "accepted" | "declined";

@Entity("connections")
export class Connection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  requester: User;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  addressee: User;

  @Column({ type: "text", default: "pending" })
  status: ConnectionStatus;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated: Date;
}

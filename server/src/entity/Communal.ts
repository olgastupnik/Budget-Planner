import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Users } from "./User";

@Entity("communal")
export class Communal {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("numeric", { scale: 4, precision: 15 })
  total: number;

  @Column("timestamp")
  timestamp: Date;

  @Column("jsonb")
  bills: any;

  @ManyToOne(() => Users, (user: { communal: any }) => user.communal, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user_id: Users;
}

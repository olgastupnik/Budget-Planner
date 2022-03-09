import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { WishList } from "./WishList";
import { Users } from "./User";
import { Category } from "./Category";
export type TTypeHistory = "expense" | "income";

@Entity("history")
export class History {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("numeric", { scale: 4, precision: 15 })
  amount: number;

  @Column("varchar", { length: 50 })
  type: TTypeHistory;

  @ManyToOne(() => Users, (user: { history: any }) => user.history, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: Users;

  @ManyToOne(() => Category, (category: { history: any }) => category.history, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "category_id" })
  category: Category["id"] | null;

  @ManyToOne(() => WishList, (wishList: { history: any }) => wishList.history, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "wish_list_id" })
  wish_list: WishList["id"] | null;
}

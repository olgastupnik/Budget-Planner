import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from "typeorm";

import { PERMISSIONS_TYPE } from "../constants";
import { WishList, Users } from "../entity";

@Entity("user_wish_list")
export class UserWishList {
  @PrimaryColumn("uuid")
  user_id: string;

  @PrimaryColumn("uuid")
  wish_list_id: string;

  @Column({ type: "boolean", default: false })
  is_favorite: boolean;

  @Column({ type: "boolean", default: false })
  is_owner: boolean;

  @Column("text", {
    array: true,
  })
  permission: PERMISSIONS_TYPE[];

  @ManyToOne(() => Users, (user: Users) => user.userToWishList, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: "user_id" })
  user: Users;

  @ManyToOne(
    () => WishList,
    (wish_list: WishList) => wish_list.userToWishList,
    {
      createForeignKeyConstraints: false,
      cascade: true,
    }
  )
  @JoinColumn({ name: "wish_list_id" })
  wish_list: WishList;
}

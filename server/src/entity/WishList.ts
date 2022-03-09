import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";

import { UserWishList } from "./UserWishList";
import { History } from "./History";
import { Users } from "./User";
import { InfColumn } from "./InfColumn";

@Entity("wish_list")
export class WishList extends InfColumn {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", default: null, nullable: true })
  photo: string | null;

  @Column("numeric", { scale: 4, precision: 15, default: 0 })
  current_amount: number;

  @Column("numeric", { scale: 4, precision: 15, default: 0 })
  total_amount: number;

  @OneToMany(
    () => History,
    (history: { wishList: WishList }) => history.wishList,
    {
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      eager: true,
    }
  )
  history: History[];

  @OneToMany(
    () => UserWishList,
    (userToWishList: UserWishList) => userToWishList.user,
    {
      createForeignKeyConstraints: false,
    }
  )
  @JoinColumn({ referencedColumnName: "wish_list_id" })
  userToWishList!: UserWishList;

  @ManyToMany(() => Users, {
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinTable({
    name: "user_wish_list",
    joinColumn: {
      name: "wish_list_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  user: Users[];
}

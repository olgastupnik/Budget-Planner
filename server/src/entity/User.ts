import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";

import { History } from "./History";
import { Category } from "./Category";
import { UserCategory } from "./UserCategory";
import { WishList } from "./WishList";
import { UserWishList } from "./UserWishList";
import { Communal } from "./Communal";
import { ROLES_TYPE } from "../constants";

@Entity("users")
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", enum: ROLES_TYPE, default: ROLES_TYPE.USER })
  role: string;

  @Column("varchar", { length: 100 })
  first_name: string;

  @Column("varchar", { length: 100 })
  last_name: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column("varchar", { length: 300, nullable: true, default: null })
  avatar: string;

  @Column("varchar", { length: 100 })
  password: string;

  @Column("numeric", { scale: 4, precision: 15 })
  budget_amount: number;

  @OneToMany(() => History, (history: { user: any }) => history.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "history" })
  history: History[];

  @OneToMany(
    () => UserCategory,
    (userCategory: UserCategory) => userCategory.category,
    {
      createForeignKeyConstraints: false,
    }
  )
  @JoinColumn({ referencedColumnName: "user_id" })
  userToCategories!: UserCategory;

  @OneToMany(
    () => UserWishList,
    (UserWishList: UserWishList) => UserWishList.wish_list,
    {
      createForeignKeyConstraints: false,
    }
  )
  @JoinColumn({ referencedColumnName: "user_id" })
  userToWishList!: UserWishList;

  @ManyToMany(() => Category, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: "user_categories",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  category: Category[];

  @ManyToMany(() => WishList, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: "user_wish_list",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "wish_list_id",
      referencedColumnName: "id",
    },
  })
  wish_list: WishList[];

  @OneToMany(() => Communal, (communal: { user: Users }) => communal.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  communal: Promise<Communal[]>;

}

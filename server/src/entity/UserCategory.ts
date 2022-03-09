import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";

import { Category } from "./Category";
import { Users } from "./User";
@Entity("user_categories")
export class UserCategory {
  @PrimaryColumn("uuid")
  user_id: string;

  @PrimaryColumn("uuid")
  category_id: string;

  @ManyToOne(() => Users, (user: Users) => user.userToCategories, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  @JoinColumn({ name: "user_id" })
  user: Users;

  @ManyToOne(
    () => Category,
    (category: Category) => category.userToCategories,
    {
      createForeignKeyConstraints: false,
      cascade: true,
    }
  )
  @JoinColumn({ name: "category_id" })
  category: Category;
}

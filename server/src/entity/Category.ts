import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from "typeorm";

import { History } from "./History";
import { InfColumn } from "./InfColumn";
import { Users } from "./User";
import { UserCategory } from "./UserCategory";

@Entity("category")
export class Category extends InfColumn {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "boolean", default: false })
  is_default: boolean;

  @OneToMany(() => History, (history: { category: any }) => history.category, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  history: History[];

  @OneToMany(
    () => UserCategory,
    (userToCategory: UserCategory) => userToCategory.user,
    {
      createForeignKeyConstraints: false,
    }
  )
  @JoinColumn({ referencedColumnName: "category_id" })
  userToCategories!: UserCategory;

  @ManyToMany(() => Users, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: "user_categories",
    joinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  user: Users[];
}

import { Column } from "typeorm";

export abstract class InfColumn {
  @Column("varchar", { length: 100 })
  title: string;

  @Column("varchar", { length: 500 })
  description: string;
}

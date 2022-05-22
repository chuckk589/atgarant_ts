import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Invoicestatuses {
  @PrimaryKey()
  id!: number;

  @Unique({ name: 'value' })
  @Property({ length: 255, nullable: true })
  value?: string;

  @Property({ length: 255, nullable: true })
  name?: string;
}

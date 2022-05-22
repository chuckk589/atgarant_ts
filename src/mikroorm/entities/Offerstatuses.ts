import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Offerstatuses {
  constructor(payload: any) {
    Object.assign(this, payload);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'value' })
  @Property({ length: 255, nullable: true })
  value?: string;

  @Property({ length: 255, nullable: true })
  name?: string;
}

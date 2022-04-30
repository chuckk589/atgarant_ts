import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Configs {
  constructor(payload: any) {
    Object.assign(this, payload);
  }

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'name' })
  @Property({ length: 255, nullable: true })
  name?: string;

  @Property({ length: 512, nullable: true })
  value?: string;

  @Property({ length: 255, nullable: true })
  category?: string;

  @Property({ length: 255, nullable: true })
  description?: string;

  @Property({ fieldName: 'requiresReboot', nullable: true })
  requiresReboot?: number;

}

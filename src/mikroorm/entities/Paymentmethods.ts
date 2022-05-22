import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Paymentmethods {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255, nullable: true })
  value?: string;

  @Property({ length: 255, nullable: true })
  name?: string;

  @Property({ fieldName: 'feePercent', nullable: true })
  feePercent?: number;

  @Property({ fieldName: 'feeRaw', nullable: true })
  feeRaw?: number;

  @Property({ fieldName: 'minSum', nullable: true })
  minSum?: number;

  @Property({ fieldName: 'maxSum', nullable: true })
  maxSum?: number;
}

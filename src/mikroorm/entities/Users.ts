import { AfterCreate, BeforeCreate, BeforeUpdate, Collection, Entity, EventArgs, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { compare, hash } from 'bcrypt';
import { Arbitraries } from './Arbitraries';
import { Invoices } from './Invoices';
import { Profiles } from './Profiles';

@Entity()
export class Users {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'chat_id' })
  @Property({ length: 255, nullable: true })
  chatId?: string;

  @Unique({ name: 'username' })
  @Property({ length: 255, nullable: true })
  username?: string;

  @Property({ length: 255, nullable: true })
  firstName?: string;

  @Property({ length: 255, nullable: true })
  password?: string;

  @Property({ length: 255, nullable: true, default: 'ru' })
  locale?: string;

  @Property({ nullable: true, default: 0 })
  role?: number = 0;

  @Property({ fieldName: 'acceptedRules', nullable: true, default: 0 })
  acceptedRules?: number = 0;

  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Arbitraries, arb => arb.arbiter)
  arbs = new Collection<Arbitraries>(this);

  @BeforeUpdate()
  @BeforeCreate()
  async beforeCreate(): Promise<void> {
    if (this.password) {
      this.password = await hash(this.password, 10)
    }
  }
  async comparePassword(password: string): Promise<boolean> {
    return await compare(password, this.password);
  }
  @AfterCreate()
  afterCreate(args: EventArgs<Users>) {
    const profile = new Profiles()
    profile.userId = this
    args.em.getDriver().nativeInsert('Profiles', profile)
  }
}
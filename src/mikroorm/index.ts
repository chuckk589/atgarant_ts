import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import config from '../configs/mikro-orm.config';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries'
import { Configs } from './entities/Configs';
import { Invoices } from './entities/Invoices';
import { Invoicestatuses } from './entities/Invoicestatuses';
import { Links } from './entities/Links';
import { Offers } from './entities/Offers';
import { Offerstatuses } from './entities/Offerstatuses';
import { Paymentmethods } from './entities/Paymentmethods';
import { Reviews } from './entities/Reviews';
import { Users } from './entities/Users';
import { Violations } from './entities/Violations';
import { Profiles } from './entities/Profiles';

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
    ArbitraryRepository: EntityRepository<Arbitraries>,
    ConfigRepository: EntityRepository<Configs>,
    InvoiceRepository: EntityRepository<Invoices>,
    InvoiceStatusRepository: EntityRepository<Invoicestatuses>,
    LinkRepository: EntityRepository<Links>,
    OfferRepository: EntityRepository<Offers>,
    OfferStatusRepository: EntityRepository<Offerstatuses>,
    PaymentMethodRepository: EntityRepository<Paymentmethods>,
    ProfileRepository: EntityRepository<Profiles>,
    ReviewRepository: EntityRepository<Reviews>,
    UserRepository: EntityRepository<Users>,
    ViolationRepository: EntityRepository<Violations>,

};

export const init = async () => {
    DI.orm = await MikroORM.init(config)
    DI.em = DI.orm.em;
    DI.ArbitraryRepository = DI.orm.em.getRepository(Arbitraries);
    DI.ConfigRepository = DI.orm.em.getRepository(Configs);
    DI.InvoiceRepository = DI.orm.em.getRepository(Invoices);
    DI.InvoiceStatusRepository = DI.orm.em.getRepository(Invoicestatuses);
    DI.LinkRepository = DI.orm.em.getRepository(Links);
    DI.OfferRepository = DI.orm.em.getRepository(Offers);
    DI.OfferStatusRepository = DI.orm.em.getRepository(Offerstatuses);
    DI.PaymentMethodRepository = DI.orm.em.getRepository(Paymentmethods);
    DI.ProfileRepository = DI.orm.em.getRepository(Profiles);
    DI.ReviewRepository = DI.orm.em.getRepository(Reviews);
    DI.UserRepository = DI.orm.em.getRepository(Users);
    DI.ViolationRepository = DI.orm.em.getRepository(Violations);
}
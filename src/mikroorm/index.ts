import { EntityManager, MikroORM } from '@mikro-orm/core';

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
};

export const init = async () => {
    DI.orm = await MikroORM.init({
        type: 'mysql',
        allowGlobalContext: true,
        clientUrl: process.env.database,
        entities: ['./dist/mikroorm/entities/'],
        entitiesTs: ['./src/mikroorm/entities/'],
    })
    DI.em = DI.orm.em;
}
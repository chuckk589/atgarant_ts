"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const MikroORMOptions = {
    type: 'mysql',
    allowGlobalContext: true,
    ...(process.env.NODE_ENV === 'development' ? { debug: true, logger: console.log.bind(console) } : {}),
    entities: ['./dist/mikroorm/entities/'],
    entitiesTs: ['./src/mikroorm/entities/'],
    clientUrl: process.env.NODE_ENV === 'development' ? process.env.DB_URL_DEV : process.env.DB_URL,
    seeder: {
        path: './dist/mikroorm/seeders',
        pathTs: './src/mikroorm/seeders',
        defaultSeeder: 'DatabaseSeeder',
        glob: '!(*.d).{js,ts}',
        emit: 'ts',
        fileName: (className) => className,
    },
};
exports.default = MikroORMOptions;
//# sourceMappingURL=mikro-orm.config.js.map
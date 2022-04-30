"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
(async () => {
    const orm = await core_1.MikroORM.init({
        discovery: {
            warnWhenNoEntities: false,
        },
        dbName: "botgenix",
        type: "mysql",
        host: process.env.MYSQL_HOST || "127.0.0.1",
        port: Number(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USERNAME || "mysql",
        password: process.env.MYSQL_PASSWORD || "mysql",
    });
    const generator = orm.getEntityGenerator();
    const dump = await generator.generate({
        save: true,
        baseDir: process.cwd() + '/src/mikroorm/entities',
    });
    console.log(dump);
    await orm.close(true);
})();
//# sourceMappingURL=generate-entities.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const sql_highlighter_1 = require("@mikro-orm/sql-highlighter");
exports.config = {
    dbName: "atgarant",
    type: "mysql",
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USERNAME || "mysql",
    password: process.env.MYSQL_PASSWORD || "mysql",
    highlighter: new sql_highlighter_1.SqlHighlighter(),
    allowGlobalContext: true,
    entities: ['./dist/mikroorm/entities/'],
    entitiesTs: ['./src/mikroorm/entities/'],
};
exports.default = exports.config;
//# sourceMappingURL=mikro-orm.config.js.map
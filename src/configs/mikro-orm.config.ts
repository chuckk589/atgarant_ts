import { SqlHighlighter } from "@mikro-orm/sql-highlighter";
import { Options } from "@mikro-orm/core";

export const config: Options = {
  dbName: "atgarant",
  type: "mysql",
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USERNAME || "mysql",
  password: process.env.MYSQL_PASSWORD || "mysql",
  // as we are using class references here, we don't need to specify `entitiesTs` option
  highlighter: new SqlHighlighter(),
  // discovery: { disableDynamicFileAccess: true },
  allowGlobalContext: true,
  entities: ['./dist/mikroorm/entities/'],
  entitiesTs: ['./src/mikroorm/entities/'],
  // debug: true,
};

export default config;

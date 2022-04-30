"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.botOptionsProvider = exports.ORMOptionsProvider = void 0;
const config_1 = require("@nestjs/config");
const global_composer_1 = require("../bot/global/global.composer");
const global_module_1 = require("../bot/global/global.module");
const checkTime_1 = __importDefault(require("../bot/middleware/checkTime"));
const i18n_1 = __importDefault(require("../bot/middleware/i18n"));
const session_1 = require("../bot/middleware/session");
const router_controller_1 = require("../bot/router/router.controller");
const router_module_1 = require("../bot/router/router.module");
const core_1 = require("@mikro-orm/core");
const Configs_1 = require("../mikroorm/entities/Configs");
exports.ORMOptionsProvider = {
    inject: [config_1.ConfigService],
    useFactory: (configService) => {
        return {
            type: 'mysql',
            allowGlobalContext: true,
            entities: ['./dist/src/mikroorm/entities/'],
            entitiesTs: ['./src/mikroorm/entities/'],
            clientUrl: configService.get('database', { infer: true })
        };
    }
};
exports.botOptionsProvider = {
    imports: [
        global_module_1.globalModule,
        router_module_1.routerModule,
    ],
    inject: [
        core_1.MikroORM,
        global_composer_1.globalComposer,
        router_controller_1.routerController,
    ],
    useFactory: async (orm, ...composers) => {
        const config = await orm.em.findOne(Configs_1.Configs, { name: 'BOT_TOKEN_PROD' });
        return {
            token: config.value,
            composers: composers.map(c => c.getMiddleware()),
            middleware: [session_1.session, checkTime_1.default, i18n_1.default.middleware()]
        };
    }
};
//# sourceMappingURL=providers.js.map
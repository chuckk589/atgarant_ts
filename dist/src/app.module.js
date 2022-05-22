"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const nestjs_pino_1 = require("nestjs-pino");
const bot_module_1 = require("./bot/bot.module");
const providers_1 = require("./common/providers");
const path_1 = require("path");
const serve_static_1 = require("@nestjs/serve-static");
const app_config_module_1 = require("./app-config/app-config.module");
const user_module_1 = require("./user/user.module");
const payments_module_1 = require("./payments/payments.module");
const telegram_module_1 = require("./telegram/telegram.module");
const auth_module_1 = require("./auth/auth.module");
const violation_module_1 = require("./violation/violation.module");
const review_module_1 = require("./review/review.module");
const offer_module_1 = require("./offer/offer.module");
const link_module_1 = require("./link/link.module");
const config_module_1 = require("./config/config.module");
const arbitrary_module_1 = require("./arbitrary/arbitrary.module");
const webapp_module_1 = require("./webapp/webapp.module");
const mikro_orm_config_1 = __importDefault(require("./configs/mikro-orm.config"));
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_config_module_1.AppConfigModule.forRootAsync(),
            nestjs_pino_1.LoggerModule.forRoot(),
            bot_module_1.BotModule.forRootAsync(providers_1.botOptionsProvider),
            serve_static_1.ServeStaticModule.forRoot({ rootPath: (0, path_1.join)(__dirname, '..', 'public') }),
            user_module_1.UserModule,
            payments_module_1.PaymentsModule,
            telegram_module_1.TelegramModule,
            auth_module_1.AuthModule,
            violation_module_1.ViolationModule,
            review_module_1.ReviewModule,
            offer_module_1.OfferModule,
            link_module_1.LinkModule,
            config_module_1.ConfigModule,
            arbitrary_module_1.ArbitraryModule,
            webapp_module_1.WebappModule,
            nestjs_1.MikroOrmModule.forRoot(mikro_orm_config_1.default),
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
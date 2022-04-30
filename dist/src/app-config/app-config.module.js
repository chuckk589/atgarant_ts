"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppConfigModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigModule = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Configs_1 = require("../mikroorm/entities/Configs");
const Invoicestatuses_1 = require("../mikroorm/entities/Invoicestatuses");
const Offerstatuses_1 = require("../mikroorm/entities/Offerstatuses");
const Paymentmethods_1 = require("../mikroorm/entities/Paymentmethods");
const app_config_service_1 = require("./app-config.service");
let AppConfigModule = AppConfigModule_1 = class AppConfigModule {
    constructor(em) {
        this.em = em;
    }
    static forRootAsync(options = {}) {
        const BotOptionsProvider = {
            provide: 'test',
            useFactory: async (orm) => {
                const configs = await orm.em.find(Configs_1.Configs, {});
                configs.map(config => process.env[config.name] = config.value);
                const paymentMethods = await orm.em.find(Paymentmethods_1.Paymentmethods, {});
                paymentMethods.map(paymentMethod => process.env[paymentMethod.value] = `${paymentMethod.feeRaw}:${paymentMethod.feePercent}:${paymentMethod.minSum}:${paymentMethod.maxSum}:${paymentMethod.id}`);
                const offerStatuses = await orm.em.find(Offerstatuses_1.Offerstatuses, {});
                offerStatuses.map(offerStatus => process.env[`offerStatus_${offerStatus.id}`] = `${offerStatus.value}:${offerStatus.name}`);
                const invoiceStatuses = await orm.em.find(Invoicestatuses_1.Invoicestatuses, {});
                invoiceStatuses.map(invoiceStatus => process.env[`invoiceStatus_${invoiceStatus.id}`] = `${invoiceStatus.value}:${invoiceStatus.name}`);
                return {};
            },
            inject: [core_1.MikroORM],
        };
        return {
            module: AppConfigModule_1,
            imports: [config_1.ConfigModule.forRoot(options)],
            providers: [BotOptionsProvider],
            exports: [config_1.ConfigModule],
        };
    }
};
AppConfigModule = AppConfigModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [app_config_service_1.AppConfigService],
        exports: [app_config_service_1.AppConfigService]
    }),
    __metadata("design:paramtypes", [core_1.EntityManager])
], AppConfigModule);
exports.AppConfigModule = AppConfigModule;
//# sourceMappingURL=app-config.module.js.map
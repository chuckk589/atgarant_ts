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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("../app-config/app-config.service");
const Configs_1 = require("../mikroorm/entities/Configs");
const Paymentmethods_1 = require("../mikroorm/entities/Paymentmethods");
let ConfigService = class ConfigService {
    constructor(em, AppConfigService) {
        this.em = em;
        this.AppConfigService = AppConfigService;
    }
    async update(body) {
        if (typeof body.id === 'string') {
            if (body.value.match(/^\d* \d* \d* \d*$/)) {
                const id = body.id.split('_').pop();
                const values = body.value.split(' ').map(v => Number(v));
                await this.em.nativeUpdate(Paymentmethods_1.Paymentmethods, { id: Number(id) }, {
                    feeRaw: values[0],
                    feePercent: values[1],
                    minSum: values[2],
                    maxSum: values[3]
                });
                process.env[body.name] = body.value;
            }
        }
        else {
            await this.em.nativeUpdate(Configs_1.Configs, { id: Number(body.id) }, {
                value: body.value,
            });
            process.env[body.name] = body.value;
        }
    }
    async findAll() {
        const configs = await this.em.find(Configs_1.Configs, {});
        const pms = this.AppConfigService.payments;
        configs.concat(pms.map(pm => new Configs_1.Configs({
            id: `PMTH_${pm.id}`,
            name: pm.method,
            value: `${pm.feeRaw} ${pm.feePercent} ${pm.minSum} ${pm.maxSum}`,
            category: 'Misc',
            requiresReboot: 0,
            description: 'Настройки способа оплаты - через пробел, целые числа:\nМинимальная комиссия в рублях\nМинимальная комиссия в процентах\nМинимальная сумма сделки в рублях\nМаксимальная сумма сделки в рублях'
        })));
        return configs;
    }
};
ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager,
        app_config_service_1.AppConfigService])
], ConfigService);
exports.ConfigService = ConfigService;
//# sourceMappingURL=config.service.js.map
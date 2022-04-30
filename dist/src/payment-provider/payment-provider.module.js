"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PaymentProviderModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderModule = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const Configs_1 = require("../mikroorm/entities/Configs");
const btc_core_controller_1 = require("./btc-core/btc-core.controller");
const btc_core_service_1 = require("./btc-core/btc-core.service");
const coin_pay_controller_1 = require("./coin-pay/coin-pay.controller");
const coin_pay_service_1 = require("./coin-pay/coin-pay.service");
const app_events_module_1 = require("../app-events/app-events.module");
let PaymentProviderModule = PaymentProviderModule_1 = class PaymentProviderModule {
    static forRootAsync(options) {
        const PaymentsOptionsProvider = {
            provide: constants_1.PAYMENTS_CONTROLLER,
            useFactory: async (orm, a, b) => {
                const config = await orm.em.findOne(Configs_1.Configs, { name: 'PAYMENT_SERVICE' });
                return config.value == 'btc-core' ? b : a;
            },
            inject: [core_1.MikroORM, coin_pay_controller_1.CoinPayController, btc_core_controller_1.BtcCoreController],
        };
        return {
            module: PaymentProviderModule_1,
            providers: [PaymentsOptionsProvider],
            exports: [PaymentsOptionsProvider],
        };
    }
};
PaymentProviderModule = PaymentProviderModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => app_events_module_1.AppEventsModule)],
        providers: [
            coin_pay_controller_1.CoinPayController,
            coin_pay_service_1.CoinPayService,
            btc_core_controller_1.BtcCoreController,
            btc_core_service_1.BtcCoreService
        ],
        exports: [coin_pay_controller_1.CoinPayController, btc_core_controller_1.BtcCoreController]
    })
], PaymentProviderModule);
exports.PaymentProviderModule = PaymentProviderModule;
//# sourceMappingURL=payment-provider.module.js.map
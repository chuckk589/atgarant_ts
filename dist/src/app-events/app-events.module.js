"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEventsModule = void 0;
const common_1 = require("@nestjs/common");
const offer_module_1 = require("../bot/offer-menu/offer.module");
const payment_provider_module_1 = require("../payment-provider/payment-provider.module");
const telegram_module_1 = require("../telegram/telegram.module");
const app_events_controller_1 = require("./app-events.controller");
const app_events_service_1 = require("./app-events.service");
let AppEventsModule = class AppEventsModule {
};
AppEventsModule = __decorate([
    (0, common_1.Module)({
        imports: [offer_module_1.offerModule, telegram_module_1.TelegramModule, payment_provider_module_1.PaymentProviderModule.forRootAsync()],
        providers: [app_events_service_1.AppEventsService, app_events_controller_1.AppEventsController],
        exports: [app_events_controller_1.AppEventsController]
    })
], AppEventsModule);
exports.AppEventsModule = AppEventsModule;
//# sourceMappingURL=app-events.module.js.map
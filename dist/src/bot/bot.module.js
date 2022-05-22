"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BotModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotModule = void 0;
const common_1 = require("@nestjs/common");
const factories_1 = require("../common/factories");
const constants_1 = require("../constants");
let BotModule = BotModule_1 = class BotModule {
    static forRootAsync(options) {
        const BotProvider = {
            provide: constants_1.BOT_NAME,
            useFactory: async (options) => await (0, factories_1.createBotFactory)(options),
            inject: [constants_1.BOT_OPTIONS],
        };
        const BotOptionsProvider = {
            provide: constants_1.BOT_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject || [],
        };
        return {
            module: BotModule_1,
            imports: options.imports,
            providers: [BotProvider, BotOptionsProvider],
            exports: [BotProvider, BotOptionsProvider],
        };
    }
};
BotModule = BotModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], BotModule);
exports.BotModule = BotModule;
//# sourceMappingURL=bot.module.js.map
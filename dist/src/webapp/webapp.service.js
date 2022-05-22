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
exports.WebappService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("../app-config/app-config.service");
const Paymentmethods_1 = require("../mikroorm/entities/Paymentmethods");
const Users_1 = require("../mikroorm/entities/Users");
const retrieve_pm_dto_1 = require("./dto/retrieve-pm.dto");
const retrieve_user_dto_1 = require("./dto/retrieve-user.dto");
let WebappService = class WebappService {
    constructor(em, AppConfigService) {
        this.em = em;
        this.AppConfigService = AppConfigService;
    }
    async getUsers(user) {
        const users = await this.em.find(Users_1.Users, {
            $or: [{ chatId: { $like: `%${String(user)}%` } }, { username: { $like: `%${String(user)}%` } }],
        }, {
            populate: ['violations'],
            limit: 6,
        });
        return users.map((user) => new retrieve_user_dto_1.RetrieveWebAppUser(user));
    }
    async findConfigs() {
        const pms = await this.em.find(Paymentmethods_1.Paymentmethods, {});
        return pms.map((pm) => new retrieve_pm_dto_1.RetirevePmDto(pm));
    }
    findAll() {
        return `This action returns all webapp`;
    }
    findOne(id) {
        return `This action returns a #${id} webapp`;
    }
    remove(id) {
        return `This action removes a #${id} webapp`;
    }
};
WebappService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager, app_config_service_1.AppConfigService])
], WebappService);
exports.WebappService = WebappService;
//# sourceMappingURL=webapp.service.js.map
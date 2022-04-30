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
exports.AuthService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const Users_1 = require("../mikroorm/entities/Users");
let AuthService = class AuthService {
    constructor(jwtService, em) {
        this.jwtService = jwtService;
        this.em = em;
    }
    async validateUser(chatId, pass) {
        const user = await this.em.findOne(Users_1.Users, { chatId: String(chatId) });
        if (user && user.comparePassword(pass)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            username: user.username,
            chat_id: user.chatId,
            sub: user.id,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.EntityManager])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
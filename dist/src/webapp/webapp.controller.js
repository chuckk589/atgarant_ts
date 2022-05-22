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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebappController = void 0;
const common_1 = require("@nestjs/common");
const webapp_service_1 = require("./webapp.service");
let WebappController = class WebappController {
    constructor(webappService) {
        this.webappService = webappService;
    }
    findConfigs() {
        return this.webappService.findConfigs();
    }
    getUsers(user) {
        return this.webappService.getUsers(user);
    }
    findAll() {
        return this.webappService.findAll();
    }
    findOne(id) {
        return this.webappService.findOne(+id);
    }
    remove(id) {
        return this.webappService.remove(+id);
    }
};
__decorate([
    (0, common_1.Get)('configs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebappController.prototype, "findConfigs", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Query)('partial')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WebappController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebappController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebappController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebappController.prototype, "remove", null);
WebappController = __decorate([
    (0, common_1.Controller)({
        path: 'webapp',
        version: '1',
    }),
    __metadata("design:paramtypes", [webapp_service_1.WebappService])
], WebappController);
exports.WebappController = WebappController;
//# sourceMappingURL=webapp.controller.js.map
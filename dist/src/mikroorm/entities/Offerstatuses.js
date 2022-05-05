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
exports.Offerstatuses = void 0;
const core_1 = require("@mikro-orm/core");
let Offerstatuses = class Offerstatuses {
    constructor(payload) {
        Object.assign(this, payload);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Offerstatuses.prototype, "id", void 0);
__decorate([
    (0, core_1.Unique)({ name: 'value' }),
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Offerstatuses.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Offerstatuses.prototype, "name", void 0);
Offerstatuses = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Offerstatuses);
exports.Offerstatuses = Offerstatuses;
//# sourceMappingURL=Offerstatuses.js.map
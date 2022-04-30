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
exports.Links = void 0;
const core_1 = require("@mikro-orm/core");
const Users_1 = require("./Users");
let Links = class Links {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Links.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Links.prototype, "url", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Links.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Links.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Users_1.Users, fieldName: 'userId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'userId' }),
    __metadata("design:type", Users_1.Users)
], Links.prototype, "userId", void 0);
Links = __decorate([
    (0, core_1.Entity)()
], Links);
exports.Links = Links;
//# sourceMappingURL=Links.js.map
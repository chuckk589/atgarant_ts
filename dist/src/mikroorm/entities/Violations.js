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
exports.Violations = void 0;
const core_1 = require("@mikro-orm/core");
const Users_1 = require("./Users");
let Violations = class Violations {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Violations.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 512, nullable: true }),
    __metadata("design:type", String)
], Violations.prototype, "text", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Violations.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Violations.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)({
        entity: () => Users_1.Users,
        fieldName: 'userId',
        onUpdateIntegrity: 'cascade',
        onDelete: 'cascade',
        nullable: true,
        index: 'userId',
    }),
    __metadata("design:type", Users_1.Users)
], Violations.prototype, "user", void 0);
Violations = __decorate([
    (0, core_1.Entity)()
], Violations);
exports.Violations = Violations;
//# sourceMappingURL=Violations.js.map
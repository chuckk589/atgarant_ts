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
exports.Users = void 0;
const core_1 = require("@mikro-orm/core");
const bcrypt_1 = require("bcrypt");
const Arbitraries_1 = require("./Arbitraries");
const Profiles_1 = require("./Profiles");
const Violations_1 = require("./Violations");
let Users = class Users {
    constructor() {
        this.role = 0;
        this.acceptedRules = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.arbs = new core_1.Collection(this);
        this.violations = new core_1.Collection(this);
    }
    async beforeCreate() {
        if (this.password) {
            this.password = await (0, bcrypt_1.hash)(this.password, 10);
        }
    }
    async comparePassword(password) {
        if (this.password) {
            return await (0, bcrypt_1.compare)(password, this.password);
        }
        return true;
    }
    afterCreate(args) {
        const profile = new Profiles_1.Profiles();
        profile.user = this;
        args.em.getDriver().nativeInsert('Profiles', profile);
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, core_1.Unique)({ name: 'chat_id' }),
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "chatId", void 0);
__decorate([
    (0, core_1.Unique)({ name: 'username' }),
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "firstName", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true, default: 'ru' }),
    __metadata("design:type", String)
], Users.prototype, "locale", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Users.prototype, "role", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'acceptedRules', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Users.prototype, "acceptedRules", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Arbitraries_1.Arbitraries, arb => arb.arbiter),
    __metadata("design:type", Object)
], Users.prototype, "arbs", void 0);
__decorate([
    (0, core_1.OneToOne)(() => Profiles_1.Profiles, profile => profile.user, { owner: true, orphanRemoval: true }),
    __metadata("design:type", Profiles_1.Profiles)
], Users.prototype, "profile", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Violations_1.Violations, violation => violation.user),
    __metadata("design:type", Object)
], Users.prototype, "violations", void 0);
__decorate([
    (0, core_1.BeforeUpdate)(),
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Users.prototype, "beforeCreate", null);
__decorate([
    (0, core_1.AfterCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Users.prototype, "afterCreate", null);
Users = __decorate([
    (0, core_1.Entity)()
], Users);
exports.Users = Users;
//# sourceMappingURL=Users.js.map
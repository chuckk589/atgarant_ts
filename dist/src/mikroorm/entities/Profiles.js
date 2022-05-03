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
exports.Profiles = void 0;
const core_1 = require("@mikro-orm/core");
const Users_1 = require("./Users");
let Profiles = class Profiles {
    constructor() {
        this.offersAsBuyer = 0;
        this.totalOfferValueRub = 0;
        this.offersAsSeller = 0;
        this.arbitrariesTotal = 0;
        this.feedbackPositive = 0;
        this.feedbackNegative = 0;
        this.violations = 0;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Profiles.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'offersAsBuyer', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Profiles.prototype, "offersAsBuyer", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'totalOfferValueRub', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Profiles.prototype, "totalOfferValueRub", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'offersAsSeller', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Profiles.prototype, "offersAsSeller", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'arbitrariesTotal', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Profiles.prototype, "arbitrariesTotal", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'feedbackPositive', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Profiles.prototype, "feedbackPositive", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'feedbackNegative', nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Profiles.prototype, "feedbackNegative", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Profiles.prototype, "violations", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'createdAt' }),
    __metadata("design:type", Date)
], Profiles.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'updatedAt', onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Profiles.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Users_1.Users, inversedBy: 'profile', fieldName: 'userId', index: 'userId' }),
    __metadata("design:type", Users_1.Users)
], Profiles.prototype, "user", void 0);
Profiles = __decorate([
    (0, core_1.Entity)()
], Profiles);
exports.Profiles = Profiles;
//# sourceMappingURL=Profiles.js.map
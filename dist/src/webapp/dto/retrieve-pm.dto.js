"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetirevePmDto = void 0;
class RetirevePmDto {
    constructor(pm) {
        this.value = pm.id;
        this.label = pm.name;
        this.feePercent = pm.feePercent;
        this.feeRaw = pm.feeRaw;
        this.maxSum = pm.maxSum;
        this.minSum = pm.minSum;
    }
}
exports.RetirevePmDto = RetirevePmDto;
//# sourceMappingURL=retrieve-pm.dto.js.map
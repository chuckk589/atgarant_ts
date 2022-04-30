"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiwiPaymentsDto = void 0;
class QiwiPaymentsDto {
    constructor(a) {
        if (a.bill) {
            this.status = a.bill.status.value;
            this.txnId = a.bill.billId;
        }
        else {
            this.status = a.payment.status;
            this.txnId = a.payment.txnId;
        }
    }
}
exports.QiwiPaymentsDto = QiwiPaymentsDto;
//# sourceMappingURL=qiwipayments.dto.js.map
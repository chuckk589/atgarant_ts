export class QiwiPaymentsDto {
  constructor(a: any) {
    if (a.bill) {
      this.status = a.bill.status.value;
      this.txnId = a.bill.billId;
    } else {
      this.status = a.payment.status;
      this.txnId = a.payment.txnId;
    }
  }
  status: string;
  txnId: string;
}

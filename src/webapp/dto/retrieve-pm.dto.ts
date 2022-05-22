import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';

export class RetirevePmDto {
  constructor(pm: Paymentmethods) {
    this.value = pm.id;
    this.label = pm.name;
    this.feePercent = pm.feePercent;
    this.feeRaw = pm.feeRaw;
    this.maxSum = pm.maxSum;
    this.minSum = pm.minSum;
  }
  feePercent: number;
  feeRaw: number;
  value: number;
  maxSum: number;
  label: string;
  minSum: number;
}

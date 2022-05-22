import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';
export declare class RetirevePmDto {
    constructor(pm: Paymentmethods);
    feePercent: number;
    feeRaw: number;
    value: number;
    maxSum: number;
    label: string;
    minSum: number;
}

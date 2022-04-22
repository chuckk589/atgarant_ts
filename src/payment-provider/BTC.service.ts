import { Injectable } from '@nestjs/common';
import { BasePaymentService } from 'src/types/interfaces';

@Injectable()
export class BtcCoreService extends BasePaymentService {

  create(id: number, updatePaymentDto: any) {
    return `This action updates a #${id} payment`;
  }
}

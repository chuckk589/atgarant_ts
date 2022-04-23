import { Controller, Injectable } from '@nestjs/common';
import { CoinPayService } from './coin-pay.service';

@Controller()
export class CoinPayController {
  constructor(private readonly coinPayService: CoinPayService) {
    console.log('CoinPayController constructor')
  }
}

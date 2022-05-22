import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Configs } from 'src/mikroorm/entities/Configs';
import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService {
  constructor(private readonly em: EntityManager, private readonly AppConfigService: AppConfigService) {}

  async update(body: UpdateConfigDto) {
    if (typeof body.id === 'string') {
      if (body.value.match(/^\d* \d* \d* \d*$/)) {
        const id = body.id.split('_').pop();
        const values = body.value.split(' ').map((v) => Number(v));
        await this.em.nativeUpdate(
          Paymentmethods,
          { id: Number(id) },
          {
            feeRaw: values[0],
            feePercent: values[1],
            minSum: values[2],
            maxSum: values[3],
          },
        );
        process.env[body.name] = body.value;
      }
    } else {
      await this.em.nativeUpdate(
        Configs,
        { id: Number(body.id) },
        {
          value: body.value,
        },
      );
      process.env[body.name] = body.value;
    }
  }

  async findAll() {
    const configs = await this.em.find(Configs, {});
    const pms = this.AppConfigService.payments;
    configs.concat(
      pms.map(
        (pm) =>
          new Configs({
            id: `PMTH_${pm.id}`,
            name: pm.method,
            value: `${pm.feeRaw} ${pm.feePercent} ${pm.minSum} ${pm.maxSum}`,
            category: 'Misc',
            requiresReboot: 0,
            description:
              'Настройки способа оплаты - через пробел, целые числа:\nМинимальная комиссия в рублях\nМинимальная комиссия в процентах\nМинимальная сумма сделки в рублях\nМаксимальная сумма сделки в рублях',
          }),
      ),
    );
    return configs;
  }
}

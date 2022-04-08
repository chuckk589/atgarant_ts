import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Configs } from "src/mikroorm/entities/Configs";

@Injectable()
export class BotService {
    constructor(
        private readonly em: EntityManager
    ) { }

    async test(){
        return this.em.getRepository(Configs)
    }
}
import { Module } from "@nestjs/common";
import { globalService } from './global.service'
import { globalComposer } from './global.composer'

@Module({
    providers: [globalService, globalComposer],
    exports: [globalComposer, globalService]
})
export class globalModule { }

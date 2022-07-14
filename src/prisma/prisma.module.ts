import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';


// writting globl so that prisma srvice can be accessed by auth,user and bookmark without importing it mannually
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }

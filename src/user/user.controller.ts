import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGaurd } from 'src/auth/gaurds';

//this authguard is provided by passport and this jwt startegy is written by me in startegy folder
@UseGuards(JwtGaurd)
@Controller('users')
export class UserController {
    @Get('me')
    getme(@GetUser() user: User) {
        return user;
    }
}

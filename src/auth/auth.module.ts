import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStartegy } from "./strategy";

@Module({
    controllers: [AuthController],
    providers: [AuthService, JwtStartegy],
    imports: [JwtModule.register({})],
})
export class AuthModule { }
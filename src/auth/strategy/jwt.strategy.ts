import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { use } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStartegy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECREAT'),
        })
    }

    async validate(payload: { sub: number, email: string }) {
        //here we can validate payload
        // console.log({ payload });
        // whatever is returning from here is accepted by request in other controllers
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })
        delete user.passwordhash;
        return user;
    }
}

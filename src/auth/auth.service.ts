import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService) { }

    // login and signup are two functions created for writing logic for auth

    async signup(dto: AuthDto) {

        //generate password hash
        const hash = await argon.hash(dto.password);

        //store user info in db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    passwordhash: hash
                }
            })

            //return jwt
            return this.signToken(user.id, user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException("Already registered user mail");
                }
            }
        }
    }

    async signin(dto: AuthDto) {

        //find user in db
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) {
            throw new ForbiddenException("incorrect credentials");
        }

        //if user exists check for password now
        const pwmatches = await argon.verify(user.passwordhash, dto.password)

        if (!pwmatches) {
            throw new ForbiddenException("incorrect credentials");
        }

        return this.signToken(user.id, user.email);
    }

    //this function will return jwt token
    async signToken(userId: number, email: string): Promise<{ access_token: string }> {

        const payload = {
            sub: userId,
            email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECREAT')
        })

        return {
            access_token: token
        }
    }

}
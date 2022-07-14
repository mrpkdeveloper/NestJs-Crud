import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService) { }

    // login and signup are two functions created for writing logic for auth

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

        delete user.passwordhash;
        return user;
    }

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

            //return saved user
            delete user.passwordhash;
            return user;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException("Already registered user mail");
                }
            }
        }
    }


}
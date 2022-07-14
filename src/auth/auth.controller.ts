import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

//this controller is for auth route
@Controller('auth')
export class AuthController {
    //controller uses services so we have to instanciate services inside controller 
    //this can be done using constructor 
    //this is dependency injection 
    constructor(private authservice: AuthService) { }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        console.log({
            dto: dto
        })
        return this.authservice.signin(dto);
    }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authservice.signup(dto);
    }

}
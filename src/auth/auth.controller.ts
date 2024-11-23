import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: LoginDto) {
    return this.authService.login(signInDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.register(signUpDto);
  }
}

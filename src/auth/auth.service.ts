import {
  Injectable,
  NotFoundException,
  // UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(pass: string, email: string): Promise<any> {
    try {
      const user: User = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException(
          'User not found, Verify your credentials or contact your administrator to register'
        );
      }
      const isMatch = await bcrypt.compare(pass, user?.password);
      if (!isMatch) {
        throw new NotFoundException(
          'User not found, Verify your credentials or contact your administrator to register'
        );
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: Partial<User>) {
    try {
      const verifiedUser: Partial<User> = await this.validateUser(
        user.password,
        user.email
      );

      const payload = {
        id: verifiedUser.id,
        email: verifiedUser.email,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  }

  async register(user: CreateUserDto) {
    const userExists = await this.usersService.findOneByEmail(user.email);
    if (userExists) {
      throw new NotFoundException(
        'User already exists, Verify your credentials or contact your administrator to register'
      );
    }
    return this.usersService.create({...user, password: await bcrypt.hash(user.password, 10)});
  }
}
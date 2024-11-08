import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.save(createUserDto);
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        {
          success: false,
          error: 'usuario no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }


  async update(id: number, UpdateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, UpdateUserDto);
    if (result.affected === 0) {
      throw new HttpException(
        {
          success: false,
          error: 'Usuario no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(
        {
          success: false,
          error: 'Contacto no encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return result;
  }
}

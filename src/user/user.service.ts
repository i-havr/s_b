import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import 'dotenv/config';

import { UserEntity } from '@app/user/user.entity';

import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@app/user/dto';
import { IUserResponse } from '@app/user/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // функція createUser створює юзера та записує його в БД
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail) {
      throw new HttpException(
        'Email is already registered',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = new UserEntity(); // створюється пустий екземпляр UserEntity {}

    Object.assign(newUser, createUserDto); // зараз значення юзера = payload

    return await this.userRepository.save(newUser); // за допомогою репозиторія тепер повертається entity доповнена за допомогою payload
  }

  // функція login перевіряє, чи є юзер у БД та повертає його
  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'name', 'email', 'additionalInfo', 'image', 'password'],
    });

    if (!userByEmail) {
      throw new HttpException(
        'The user is not registered',
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      userByEmail.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credentials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // delete userByEmail.password; - пароль ми видалили у функції buildUserResponse

    return userByEmail;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    const updatedUser = { ...user, ...updateUserDto };

    return await this.userRepository.save(updatedUser);
  }

  // функція findUserById повертає дані залогіненого юзера після того як токен пройшов перевірку та ми отримали id юзера. Використовуємо у мідлварі.
  findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // функція generateJwt створює та повертає токен
  generateJwt(user: UserEntity): string {
    const { id, name, email } = user;

    return sign({ id, name, email }, process.env.JWT_SECRET);
  }

  // функція buildUserResponse формує та повертає відповідь для фронтенда у необхідному вигляді
  buildUserResponse(user: UserEntity): IUserResponse {
    return {
      user: { ...user, token: this.generateJwt(user), password: undefined }, // тут видаляємо пароль, щоб він не приходив на фронтенд
    };
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@app/user/dto/createUser.dto';
import { LoginUserDto } from '@app/user/dto/loginUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { IUserResponse } from '@app/user/types/userResponse.interface';
import { compare } from 'bcrypt';
import 'dotenv/config';

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

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username is already registered',
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
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
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

    delete userByEmail.password;

    return userByEmail;
  }

  // функція findUserById повертає дані залогіненого юзера після того як токен пройшов перевірку та ми отримали id юзера
  findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // функція generateJwt створює та повертає токен
  generateJwt(user: UserEntity): string {
    const { id, username, email } = user;

    return sign({ id, username, email }, process.env.JWT_SECRET);
  }

  // функція buildUserResponse формує та повертає відповідь для фронтенда у необхідному вигляді
  buildUserResponse(user: UserEntity): IUserResponse {
    return { user: { ...user, token: this.generateJwt(user) } };
  }
}

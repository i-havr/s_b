import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UserEntity } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';

import { CreateUserDto, LoginUserDto, UpdateUserDto } from '@app/user/dto';
import { User } from '@app/user/decorators';
import { AuthGuard } from '@app/user/guards';
import { IUserResponse } from '@app/user/types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users/signup')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto, // this is payload
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto, // this is payload
  ): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    // @Req() request: IExpressRequest, <== можна було лишити так, але ми створили свій декоратор @User
    @User() user: UserEntity,
    // @User('id') currentId: number,
    // @User('username') username: string,
  ): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );

    return this.userService.buildUserResponse(user);
  }
}

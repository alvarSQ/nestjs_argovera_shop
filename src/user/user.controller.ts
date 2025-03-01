import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/update.User.dto';
import { AuthGuard } from './guards/auth.guard';
import { UserEntity } from './user.entity';
import { User } from './decorators/user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login')
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
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

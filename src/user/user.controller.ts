import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { Entity } from 'typeorm';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UserId } from '@src/decorators/userId.decorator';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { UserType } from './enum/user-type.enum';
import { Roles } from '@src/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
    return this.userService.createUser(createUserDto);
  }

  @Roles(UserType.Admin)
  @Get()
  async findAllUser(): Promise<ReturnUserDto[]> {
    return (await this.userService.findAllUser()).map(
      (userEntity) => new ReturnUserDto(userEntity),
    );
  }

  @Roles(UserType.Admin)
  @Get('/:userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.getUserByIdUsingRelations(userId),
    );
  }

  @Roles(UserType.Admin, UserType.User)
  @Put()
  async updateUser(
    @UserId() userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.updateUser(userId, updateUserDto),
    );
  }

  @Roles(UserType.Admin, UserType.User)
  @Patch()
  async updatePassword(
    @UserId() userId: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<ReturnUserDto> {
    return new ReturnUserDto(
      await this.userService.updatePasswordUser(userId, updatePasswordDto),
    );
  }
}

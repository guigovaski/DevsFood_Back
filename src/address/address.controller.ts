import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAddressDto } from './dtos/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { AddressService } from './address.service';
import { Roles } from '@src/decorators/roles.decorator';
import { UserType } from '@src/user/enum/user-type.enum';
import { UserId } from '@src/decorators/userId.decorator';
import { ReturnAddressDto } from './dtos/returnAddress.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @UserId() userId: number,
  ): Promise<AddressEntity> {
    console.log(userId);
    return this.addressService.createAddress(createAddressDto, userId);
  }

  @Get('/user')
  async findAddressByUserId(
    @UserId() userId: number,
  ): Promise<ReturnAddressDto[]> {
    return (await this.addressService.findAddressByUserId(userId)).map(
      (address) => new ReturnAddressDto(address),
    );
  }
}

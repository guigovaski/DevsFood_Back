import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsOptional()
  complement: string;

  @IsNumber()
  numberAddress: number;

  @IsString()
  cep: string;

  @IsInt()
  cityId: number;
}

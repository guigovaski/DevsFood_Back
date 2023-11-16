import { cityMock } from '@src/city/__mocks__/city.mock';
import { CreateAddressDto } from '../dtos/createAddress.dto';
import { AddressMock } from './address.mock';

export const createAddressMock: CreateAddressDto = {
  cep: AddressMock.cep,
  cityId: cityMock.id,
  complement: AddressMock.complement,
  numberAddress: AddressMock.numberAddress,
};

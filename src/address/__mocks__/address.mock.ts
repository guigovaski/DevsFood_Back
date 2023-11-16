import { cityMock } from '@src/city/__mocks__/city.mock';
import { AddressEntity } from '../entities/address.entity';
import { userEntityMock } from '@src/user/__mocks__/user.mock';

export const AddressMock: AddressEntity = {
  id: 21,
  cityId: cityMock.id,
  complement: 'complement',
  cep: '12345-678',
  numberAddress: 123,
  userId: userEntityMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

import { stateMock } from '@src/state/__mocks__/state.mock';
import { CityEntity } from '../entities/city.entity';

export const cityMock: CityEntity = {
  id: 123,
  name: 'cityNameMock',
  stateId: stateMock.id,
  createdAt: new Date(),
  updatedAt: new Date(),
};

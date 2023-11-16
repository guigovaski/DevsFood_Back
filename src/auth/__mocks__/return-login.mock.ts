import { userEntityMock } from '@src/user/__mocks__/user.mock';
import { jwtMock } from './jwt.mock';

export const returnLoginMock = {
  access_token: jwtMock,
  user: userEntityMock,
};

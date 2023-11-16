import { UpdatePasswordDto } from '../dtos/updatePassword.dto';

export const updatePasswordMock: UpdatePasswordDto = {
  oldPassword: 'abc',
  newPassword: 'cba',
};

export const updatePasswordInvalidMock: UpdatePasswordDto = {
  oldPassword: 'abcInvalid',
  newPassword: 'bcaInvalid',
};

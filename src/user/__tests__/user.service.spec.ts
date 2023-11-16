import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import {
  updatePasswordInvalidMock,
  updatePasswordMock,
} from '../__mocks__/updateUserPassword.mock';
import { updateUserMock } from '../__mocks__/updateUser.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user in findUserByEmail', async () => {
    const user = await service.findUserByEmail(userEntityMock.email);
    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserByEmail', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(
      //userEntityMock.email is not a valid email
      service.findUserByEmail(userEntityMock.email),
    ).resolves.toBeNull();
  });

  it('should return error in findUserById (error request)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    await expect(
      //userEntityMock.id is not a valid Id
      service.findUserById(userEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return user in findUserById', async () => {
    const user = await service.findUserById(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return error in findUserById', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(
      //userEntityMock.Id is not a valid Id
      service.findUserById(userEntityMock.id),
    ).resolves.toBeNull();
  });

  it('should return error in findUserByEmail (error request)', async () => {
    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());

    await expect(
      //userEntityMock.email is not a valid email
      service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrowError();
  });

  it('should return user in getUserByIdUsingRelations', async () => {
    expect(await service.getUserByIdUsingRelations(userEntityMock.id)).toEqual(
      userEntityMock,
    );
  });

  it('should return error if user exist in createUser', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrowError();
  });

  it('should return  if user  not exist in createUser', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

    expect(await service.createUser(createUserMock)).toEqual(userEntityMock);
  });

  it('should return  user after update', async () => {
    const user = await service.updateUser(userEntityMock.id, createUserMock);

    expect(user).toEqual(userEntityMock);
  });

  it('should return error in update user', async () => {
    jest.spyOn(userRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.updateUser(userEntityMock.id, updateUserMock),
    ).rejects.toThrowError();
  });

  it('should return  user after update password', async () => {
    const user = await service.updatePasswordUser(
      userEntityMock.id,
      updatePasswordMock,
    );

    expect(user).toEqual(userEntityMock);
  });

  it('should return invalid password in error', async () => {
    expect(
      service.updatePasswordUser(userEntityMock.id, updatePasswordInvalidMock),
    ).rejects.toThrowError();
  });

  it('should return error in user not exist in updatePasswordUser', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    expect(
      service.updatePasswordUser(userEntityMock.id, updatePasswordInvalidMock),
    ).rejects.toThrowError();
  });
});

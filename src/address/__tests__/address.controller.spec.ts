import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../../address/address.controller';
import { AddressService } from '../address.service';
import { createAddressMock } from '../__mocks__/create-address.mock';
import { userEntityMock } from '@src/user/__mocks__/user.mock';
import { AddressMock } from '../__mocks__/address.mock';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(AddressMock),
            findAddressByUserId: jest.fn().mockResolvedValue([AddressMock]),
          },
        },
      ],
      controllers: [AddressController],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should address entity in createAddress', async () => {
    const address = await controller.createAddress(
      createAddressMock,
      userEntityMock.id,
    );

    expect(address).toEqual(AddressMock);
    expect(addressService).toBeDefined();
  });

  it('should address entity in findAddressByUserId', async () => {
    const addresses = await controller.findAddressByUserId(userEntityMock.id);

    expect(addresses).toEqual([
      {
        id: AddressMock.id,
        complement: AddressMock.complement,
        numberAddress: AddressMock.numberAddress,
        cep: AddressMock.cep,
      },
    ]);
    expect(addressService).toBeDefined();
  });
});

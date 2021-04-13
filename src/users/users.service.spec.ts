import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserServiceErrorMessages } from '../constants/user-service-error-messages';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    save: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockResolvedValue('test-find'),
    findAll: jest.fn().mockResolvedValue('test-find-all'),
    remove: jest.fn().mockResolvedValue({}),
  };

  const createTestUserDto = new CreateUserDto({
    familyName: 'Millers',
    givenName: 'Mike',
    email: 'mike.millers@email.com',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should throw an error when createUserDto is undefined', async () => {
      await expect(service.create(undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.USER_IS_UNDEFINED),
      );
    });

    it('should call User Repository save method when called with a CreateUserDto', async () => {
      const saveSpy = jest.spyOn(mockRepository, 'save').mockResolvedValue('test-value');

      await service.create(createTestUserDto);

      expect(saveSpy).toHaveBeenCalled();
    });

    it('should add the created timestamp to the user object when called with valid params', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1557831718135);

      await service.create(createTestUserDto);

      expect(mockRepository.save).toHaveBeenCalledWith({ ...createTestUserDto, created: 1557831718135 });
    });

    it('should return the result of User Repository save method when called with valid params', async () => {
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => 1557831718135);
      mockRepository.save.mockResolvedValue(createTestUserDto);

      const result = await service.create(createTestUserDto);

      expect(result).toEqual({ ...createTestUserDto, created: 1557831718135 });
    });

    it('should throw an error when UserRepository save throws', async () => {
      mockRepository.save.mockRejectedValue('test-error');
      try {
        await service.create(createTestUserDto);
      } catch (e) {
        expect(e).toBe('test-error');
      }
    });
  });

  describe('findAll', () => {
    it('should throw an error when size and from params are not present', async () => {
      await expect(service.findAll(null, undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.UNDEFINED_FROM_AND_SIZE_PARAMETERS),
      );
    });

    it('should throw an error when only size is not present', async () => {
      await expect(service.findAll(0, undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.UNDEFINED_FROM_AND_SIZE_PARAMETERS),
      );
    });

    it('should throw an error when only from param is not present', async () => {
      await expect(service.findAll(undefined, 10)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.UNDEFINED_FROM_AND_SIZE_PARAMETERS),
      );
    });

    it('should call repository findAndCount method when valid params are passed', async () => {
      const result = service.findAll(0, 10);
    });
  });
});

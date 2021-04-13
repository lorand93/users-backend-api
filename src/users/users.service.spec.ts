import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserServiceErrorMessages } from '../constants/user-service-error-messages';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    save: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({}),
    findAndCount: jest.fn().mockResolvedValue([]),
    delete: jest.fn().mockResolvedValue({}),
  };

  const createTestUserDto = new CreateUserDto({
    familyName: 'Millers',
    givenName: 'Mike',
    email: 'mike.millers@email.com',
  });

  const updateTestUserDto = new UpdateUserDto({
    id: '1',
    familyName: 'Millers',
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw an error when createUserDto is undefined', async () => {
      await expect(service.create(undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_USER_PROVIDED),
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
      mockRepository.save.mockRejectedValueOnce('test-error');
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
        new Error(UserServiceErrorMessages.INVALID_FROM_AND_SIZE_PARAMETERS),
      );
    });

    it('should throw an error when only size is not present', async () => {
      await expect(service.findAll(0, undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_FROM_AND_SIZE_PARAMETERS),
      );
    });

    it('should throw an error when only from param is not present', async () => {
      await expect(service.findAll(undefined, 10)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_FROM_AND_SIZE_PARAMETERS),
      );
    });

    it('should throw an error when negative values are passed to from and size', async () => {
      await expect(service.findAll(-5, -10)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_FROM_AND_SIZE_PARAMETERS),
      );
    });

    it('should throw an error when repository method throws', async () => {
      mockRepository.findAndCount.mockRejectedValueOnce('test-error2');
      try {
        await service.findAll(0, 10);
      } catch (e) {
        expect(e).toBe('test-error2');
      }
    });

    it('should call repository findAndCount method when valid params are passed', async () => {
      const testValues = {
        from: 0,
        size: 10,
      };

      await service.findAll(testValues.from, testValues.size);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: testValues.size,
        skip: testValues.from,
      });
    });

    it('should call return the results from findAndCount method when successfully ran', async () => {
      const testValues = {
        from: 0,
        size: 10,
      };

      mockRepository.findAndCount.mockResolvedValue(['result', 1000]);
      const result = await service.findAll(testValues.from, testValues.size);

      expect(result).toEqual({
        result: 'result',
        totalCount: 1000,
        from: testValues.from,
        size: testValues.size,
      });
    });
  });

  describe('findOne', () => {
    it('should throw an error when id is not present', async () => {
      await expect(service.findOne(undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_ID),
      );
    });

    it('should throw an error when repository method throws', async () => {
      mockRepository.findOne.mockRejectedValueOnce(new Error('test-error'));
      await expect(service.findOne('1')).rejects.toThrowError(
        new Error('test-error'),
      );
    });

    it('should call User Repository findOne method with corresponding id when called with valid param', async () => {
      mockRepository.findOne.mockResolvedValue('test-user');

      await service.findOne('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should return the user found by findOne method when called with valid param', async () => {
      mockRepository.findOne.mockResolvedValue('test-user');

      const result = await service.findOne('1');

      expect(result).toBe('test-user');
    });
  });

  describe('update', () => {
    it('should throw an error when updateUserDto is undefined', async () => {
      await expect(service.update('1', undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_USER_PROVIDED),
      );
    });

    it('should throw an error when id is undefined', async () => {
      await expect(service.update(null, undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_ID),
      );
    });

    it('should call User Repository update method when called with UpdateUserDto', async () => {
      const updateSpy = jest.spyOn(mockRepository, 'update').mockResolvedValue('test-value');

      await service.update(updateTestUserDto.id, updateTestUserDto);

      expect(updateSpy).toHaveBeenCalledWith(updateTestUserDto.id, updateTestUserDto);
    });

    it('should call User Repository findOne twice if update was successfully done', async () => {
      await service.update(updateTestUserDto.id, updateTestUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should return the result of User Repository findOne method when called with valid params', async () => {
      mockRepository.findOne.mockResolvedValue(updateTestUserDto);
      const result = await service.update(updateTestUserDto.id, updateTestUserDto);

      expect(result).toEqual(updateTestUserDto);
    });

    it('should throw an error when UserRepository update throws', async () => {
      mockRepository.update.mockRejectedValueOnce('test-error');
      try {
        await service.update(updateTestUserDto.id, updateTestUserDto);
      } catch (e) {
        expect(e).toBe('test-error');
      }
    });

    it('should throw an error when UserRepository findOne throws', async () => {
      mockRepository.findOne.mockRejectedValueOnce('test-error');
      try {
        await service.update(updateTestUserDto.id, updateTestUserDto);
      } catch (e) {
        expect(e).toBe('test-error');
      }
    });
  });

  describe('update', () => {
    it('should throw an error when id is undefined', async () => {
      await expect(service.remove(undefined)).rejects.toThrowError(
        new Error(UserServiceErrorMessages.INVALID_ID),
      );
    });

    it('should call User Repository findOne method when called with valid id', async () => {
      const findOneSpy = jest.spyOn(mockRepository, 'findOne').mockResolvedValue('test-value');

      await service.remove('id');

      expect(findOneSpy).toHaveBeenCalledWith('id');
    });

    it('should not call User Repository remove method if there is no user with the given id', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      await service.remove('id');

      expect(mockRepository.delete).toHaveBeenCalledTimes(0);
    });

    it('should return false when there is no user with the given id', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await service.remove('id');

      expect(result).toBe(false);
    });

    it('should call User Repository remove method if the user exists', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 'existing-user-id' });

      await service.remove('existing-user-id');

      expect(mockRepository.delete).toHaveBeenCalledWith('existing-user-id')
    });

    it('should call return true if user was deleted successfully', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 'existing-user-id' });

      const result = await service.remove('existing-user-id');

      expect(result).toBe(true);
    });

    it('should throw an error when UserRepository remove throws', async () => {
      mockRepository.delete.mockRejectedValueOnce('test-error');
      try {
        await service.remove('test-id');
      } catch (e) {
        expect(e).toBe('test-error');
      }
    });

    it('should throw an error when UserRepository findOne throws', async () => {
      mockRepository.delete.mockRejectedValueOnce('test-error');
      try {
        await service.remove('test-id');
      } catch (e) {
        expect(e).toBe('test-error');
      }
    });
  });

});

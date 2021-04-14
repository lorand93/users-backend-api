import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { CreateUserDto } from './dto/create-user-dto';
import { Response as Res } from 'express';
import { HttpStatus } from '@nestjs/common';
import { UsersApiMessages } from '../constants/users-api-messages';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUsersParamsModel } from './dto/find-all-users-params.model';
import { User } from '../entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: SinonStubbedInstance<UsersService>;

  const createTestUserDto = new CreateUserDto({
    familyName: 'Millers',
    givenName: 'Mike',
    email: 'mike.millers@email.com',
  });

  const response = {
    json: (body?: any) => body,
    status: (code: number) => response,
  } as Res;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: sinon.createStubInstance(UsersService) },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('create', () => {
    it('should call userService.create method with the given user', async () => {
      const sendSpy = jest.spyOn(response, 'json');
      const statusSpy = jest.spyOn(response, 'status');
      const mockCreatedResult = {
        ...createTestUserDto,
        id: 'test-id',
        created: Date.now(),
      };
      usersService.create.resolves(mockCreatedResult);

      const result = await controller.create(createTestUserDto, response);

      expect(sendSpy).toHaveBeenCalledWith(mockCreatedResult);
      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(result).toBe(mockCreatedResult);
    });

    it('should return an error message when userService.create throws', async () => {
      const statusSpy = jest.spyOn(response, 'status');

      usersService.create.rejects('test-error');

      const result = await controller.create(createTestUserDto, response);

      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result).toStrictEqual({
        error: 'test-error',
        message: UsersApiMessages.ERROR_WHILE_CREATING_NEW_USER,
      });
    });
  });

  describe('update', () => {
    it('should call userService.update method with the given user', async () => {
      const statusSpy = jest.spyOn(response, 'status');
      const mockUpdateUser: UpdateUserDto = {
        ...createTestUserDto,
        id: 'test-user-id',
      };
      const mockExistingUser = {
        ...createTestUserDto,
        id: 'test-user-id',
        created: Date.now(),
      };

      usersService.update.onFirstCall().resolves(mockExistingUser);

      await controller.update(mockExistingUser.id, mockUpdateUser, response);

      expect(usersService.update.calledWith(mockExistingUser.id, mockUpdateUser)).toBe(true);
      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should return an error if id not present', async () => {
      const statusSpy = jest.spyOn(response, 'status');
      const mockUpdateUser: UpdateUserDto = {
        ...createTestUserDto,
        id: 'test-user-id',
      };
      const mockExistingUser = {
        ...createTestUserDto,
        id: 'test-user-id',
        created: Date.now(),
      };

      usersService.update.onFirstCall().resolves(mockExistingUser);

      const result = await controller.update(undefined, mockUpdateUser, response);

      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(result).toStrictEqual({
        id: undefined,
        message: UsersApiMessages.INVALID_ID,
      });
    });

    it('should return an error if update method throws', async () => {
      const statusSpy = jest.spyOn(response, 'status');
      const mockUpdateUser: UpdateUserDto = {
        ...createTestUserDto,
        id: 'test-user-id',
      };
      usersService.update.onFirstCall().rejects('test-error');

      const result = await controller.update(mockUpdateUser.id, mockUpdateUser, response);

      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result).toStrictEqual({
        message: UsersApiMessages.ERROR_WHILE_UPDATING_USER + mockUpdateUser.id,
        error: 'test-error',
      });
    });
  });

  describe('findAll', () => {
    const mockParams: FindAllUsersParamsModel = {
      from: '0',
      size: '10',
    };

    it('should call userService.findAll method when all params are correctly provided', async () => {
      const mockResponse = {
        result: [],
        totalCount: 0,
        from: 0,
        size: 0,
      };
      usersService.findAll.onFirstCall().resolves(mockResponse);

      const result = await controller.findAll(mockParams, response);

      expect(usersService.findAll.calledWith(+mockParams.from, +mockParams.size)).toBe(true);
      expect(result).toStrictEqual(mockResponse);
    });

    it('should call userService.findAll method when no params are provided', async () => {
      const mockResponse = {
        result: [],
        totalCount: 0,
        from: 0,
        size: 0,
      };
      usersService.findAll.onFirstCall().resolves(mockResponse);

      const result = await controller.findAll({} as FindAllUsersParamsModel, response);

      expect(usersService.findAll.calledWith(0, 10)).toBe(true);
      expect(result).toStrictEqual(mockResponse);
    });

    it('should return an error message only from param is provided', async () => {
      const mockResponse = {
        result: [],
        totalCount: 0,
        from: 0,
        size: 0,
      };
      usersService.findAll.onFirstCall().resolves(mockResponse);

      const result = await controller.findAll({ from: '0' } as FindAllUsersParamsModel, response);

      expect(usersService.findAll.notCalled).toBe(true);
      expect(result).toStrictEqual({
        message: UsersApiMessages.MISSING_PAGING_PARAMS,
      });
    });

    it('should return an error message only size param is provided', async () => {
      const mockResponse = {
        result: [],
        totalCount: 0,
        from: 0,
        size: 0,
      };
      usersService.findAll.onFirstCall().resolves(mockResponse);

      const result = await controller.findAll({ size: '0' } as FindAllUsersParamsModel, response);

      expect(usersService.findAll.notCalled).toBe(true);
      expect(result).toStrictEqual({
        message: UsersApiMessages.MISSING_PAGING_PARAMS,
      });
    });

    it('should return an error message if size is biggern than 100', async () => {
      const mockResponse = {
        result: [],
        totalCount: 0,
        from: 0,
        size: 0,
      };
      usersService.findAll.onFirstCall().resolves(mockResponse);

      const result = await controller.findAll({ size: '1000', from: '0' } as FindAllUsersParamsModel, response);

      expect(usersService.findAll.notCalled).toBe(true);
      expect(result).toStrictEqual({
        message: UsersApiMessages.PAGING_SIZE_TOO_LARGE,
      });
    });

    it('should return an error message if service method throws', async () => {
      usersService.findAll.onFirstCall().rejects('test-error');

      const result = await controller.findAll({ size: '10', from: '0' } as FindAllUsersParamsModel, response);

      expect(usersService.findAll.called).toBe(true);
      expect(result).toStrictEqual({
        error: 'test-error',
        message: UsersApiMessages.ERROR_WHILE_GETTING_USERS,
      });
    });
  });

  describe('findOne', () => {
    //TODO implement rest of test cases
    it('should call userService.findOne method when all params are correctly provided', async () => {
      const statusSpy = jest.spyOn(response, 'status');

      const testId = 'test-id';

      usersService.findOne.onFirstCall().resolves({ id: testId } as User);

      const result = await controller.findOne(testId, response);

      expect(usersService.findOne.calledWith(testId)).toBe(true);
      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.OK);
      expect(result).toStrictEqual({ id: testId });
    });
  });

  describe('remove', () => {
    //TODO implement rest of test cases
    it('should call userService.remove method when all params are correctly provided', async () => {
      const statusSpy = jest.spyOn(response, 'status');

      const testId = 'test-id';

      usersService.remove.onFirstCall().resolves(true);

      await controller.remove(testId, response);

      expect(usersService.remove.calledWith(testId)).toBe(true);
      expect(statusSpy).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });
});

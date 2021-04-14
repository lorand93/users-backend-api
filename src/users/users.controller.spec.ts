import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as sinon from 'sinon';
import { SinonStubbedInstance } from 'sinon';
import { CreateUserDto } from './dto/create-user-dto';
import { Response as Res } from 'express';
import { ArgumentMetadata, HttpStatus, Type, ValidationPipe } from '@nestjs/common';
import { UsersApiMessages } from '../constants/users-api-messages';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

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

});

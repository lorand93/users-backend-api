import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = jest.fn().mockReturnValue({
    save: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockResolvedValue('test-find'),
    findAll: jest.fn().mockResolvedValue('test-find-all'),
    remove: jest.fn().mockResolvedValue({}),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should');
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserDto } from '../src/users/dto/create-user-dto';
import { Connection, Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { UsersApiMessages } from '../src/constants/users-api-messages';

describe('End to end tests for the User Controller', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  const createTestUserDto: Partial<CreateUserDto> = {
    familyName: 'Millers',
    givenName: 'Mike',
    email: 'mike.millers@email.com',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './test-database.sqlite',
          entities: [User],
          synchronize: true,
        })],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const connection = app.get(Connection);
    userRepository = connection.getRepository(User);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {

    await userRepository.clear();
  });

  describe('[POST] /users', () => {

    it('creates a new user and returns status 201', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createTestUserDto);
      expect(response.status).toBe(HttpStatus.CREATED);
      done();
    });

    it('should create a new user and return the created user', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createTestUserDto);
      expect(response.body.created).toBeTruthy();
      expect(response.body.id).toBeTruthy();
      expect(response.body).toEqual({ ...createTestUserDto, created: response.body.created, id: response.body.id });
      done();
    });

    it('should throw an error when email is not present', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          familyName: createTestUserDto.familyName,
          givenName: createTestUserDto.givenName,
        });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      done();
    });

    it('should throw an error when email does not validate as an email', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...createTestUserDto,
          email: 'not-an-email',
        });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      done();
    });

    it('should throw an error when givenName is not present', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...createTestUserDto,
          givenName: undefined,
        });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      done();
    });

    it('should throw an error when familyName is not present', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...createTestUserDto,
          familyName: undefined,
        });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      done();
    });

    it('should throw an error when we provide the created timestamp', async (done) => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          ...createTestUserDto,
          created: Date.now(),
        });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      done();
    });
  });

  describe('[GET] /users/:id', () => {
    it('should find and return the user if it exists', async (done) => {
      const createdUser = await userRepository.save({
        ...createTestUserDto,
        created: Date.now(),
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${createdUser.id}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(createdUser);
      done();
    });

    it('should return user not found if it does not exist', async (done) => {
      const response = await request(app.getHttpServer())
        .get(`/users/testid`);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toEqual(UsersApiMessages.USER_NOT_FOUND);
      done();
    });
  });
});

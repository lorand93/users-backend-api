import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user-dto';
import { Connection } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const createTestUserDto = new CreateUserDto({
    familyName: 'Millers',
    givenName: 'Mike',
    email: 'mike.millers@email.com',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './test-database.sqlite',
          entities: [User],
          synchronize: true,
        }),],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close()
  })

  afterEach(async() => {
    const connection = app.get(Connection);
    const userRepository = connection.getRepository(User);
    await userRepository.clear()
  })

  it('creates a new user', async (done) => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        familyName: 'Test User',
        givenName: 'Mike',
        email: 'mike.millers@email.com',
      });
    expect(response.status).toBe(HttpStatus.CREATED);
    done();
  });
});

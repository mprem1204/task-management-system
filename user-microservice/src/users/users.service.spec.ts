import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { SequelizeModule, getModelToken } from '@nestjs/sequelize';
import { User } from './user.model';
import { HttpException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        SequelizeModule.forRoot({
          dialect: 'mysql',
          host: 'mydb.ctiuyqce4juy.ap-south-1.rds.amazonaws.com',
          port: 3306,
          username: 'admin',
          password: 'adminadmin',
          database: 'user_microservice_db',
          autoLoadModels: true,
        }),
        SequelizeModule.forFeature([User]),
      ],
    })
    // .overrideProvider(getModelToken(User)).useValue({})
    .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('shouldNotcreateUser', () => {
    it('should not create a user as the the username is not unique', async () => {
      const userObj = { username: 'testU2ser', email: 'newuser@xyz.com', type: 'default' };

      try {
        const result = await service.createUser(userObj);
  
        fail('Expected an error to be thrown.');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userObj = { username: Math.floor(Math.random() * 90000) + 10000, email: 'newuser@xyz.com', type: 'default' };

      try {

        const result = await service.createUser(userObj);

        console.log(result);
        
        expect(result.status).toEqual("OK");

      } catch (error) {
        fail('Expected an error to be thrown.');
      }
    });
  });

  describe('fetchUser', () => {
    it('should fetch user', async () => {

        const result = await service.getUserInfo('1');
        
        expect(result.user_details).toHaveProperty('id');
    });
  });

  describe('fetchUser', () => {
    it('should not give user deatils this is a unknown user', async () => {

        const result = await service.getUserInfo('unknownUserid');

        console.log(result);
        
        expect(result.user_details).toBeNull()
    });
  });

  

});

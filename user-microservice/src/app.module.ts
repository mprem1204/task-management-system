import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [UsersModule, SequelizeModule.forRoot({
    dialect: 'mysql',
    host: 'mydb.ctiuyqce4juy.ap-south-1.rds.amazonaws.com',
    port: 3306,
    username: 'admin',
    password: 'adminadmin',
    database: 'user_microservice_db',
    autoLoadModels: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'mydb.ctiuyqce4juy.ap-south-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: 'adminadmin',
      database: 'task_microservice_db',
      autoLoadModels: true,
      synchronize: true
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TasksModule {}

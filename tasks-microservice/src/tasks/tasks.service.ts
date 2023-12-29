// nest-app/src/modules/task/services/task.service.ts

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { createTaskSchema, editTaskSchema } from './tasks.validation';
import { OrderItem, QueryTypes } from 'sequelize';
import axios from 'axios';


@Injectable()
export class TaskService {
  constructor(@InjectModel(Task) private readonly taskModel: typeof Task) { }

  async validateRequestParams(schema: any, req_params: any) {
    try {
      const validate = await schema.validate(req_params)
    } catch (error) {
      throw error
    }
  }

  async createTask(taskObj: any): Promise<any> {
    try {
      await this.validateRequestParams(createTaskSchema, taskObj);
      const response = await axios.get(`http://localhost:3001/users/${taskObj.userId}`);

      if (!response.data.user_details) throw { message: response.data.message, status: "ERROR" }

      const newTask = await this.taskModel.create({ ...taskObj, completed: false });
      return { task: newTask, status: "OK" };
    } catch (error) {
      throw new HttpException({ error: error.message ? error.message : error.errors[0].message }, HttpStatus.BAD_REQUEST)
    }
  }

  async editTask(taskId: number, taskObj: any): Promise<any> {
    try {
      await this.validateRequestParams(editTaskSchema, taskObj);
      const existingTask = await this.taskModel.findByPk(taskId);

      if (!existingTask) {
        throw { message: 'Task not found' };
      }

      if (taskObj.title) existingTask.title = taskObj.title;
      if (taskObj.description) existingTask.description = taskObj.description;
      if (taskObj.priority) existingTask.priority = taskObj.priority;
      if (taskObj.dueDate) existingTask.dueDate = taskObj.dueDate;

      await existingTask.save();

      return { task: existingTask, status: "OK" };
    } catch (error) {
      throw new HttpException({ error: error.message ? error.message : error.errors[0].message }, HttpStatus.BAD_REQUEST)
    }
  }

  async getUserTasks(userId: number): Promise<any> {
    try {
      if (!userId) throw { message: 'userId is required' };

      const userTasks = await this.taskModel.findAll({
        where: {
          userId: userId,
        },
      });

      return { userTasks, status: "OK" };
    } catch (error) {
      throw new HttpException({ error: error.message ? error.message : error.errors[0].message }, HttpStatus.BAD_REQUEST)
    }
  }

  async markUserTaskAsComplete(userId: number, taskId: number): Promise<any> {
    try {
      if (!userId) throw { message: 'userId is required' };
      if (!taskId) throw { message: 'taskId is required' };

      const task = await this.taskModel.findOne({
        where: {
          id: taskId,
          userId: userId,
        },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      task.completed = true;

      await task.save();


      //The task mentions raising an event when a task is marked as complete.
      // but how it should be handled from a microservices perspective is not clear from the specification

      // I would genrally do the following approches
      // 1. intimate through an api (Webhook) to someother microservices
      // 2. use an publisher subscriber quee to intimate the event

      return { task, status: "OK" };
    } catch (error) {
      throw new HttpException({ error: error.message ? error.message : error.errors[0].message }, HttpStatus.BAD_REQUEST)
    }
  }

  async searchTasksByAdmin(keyword: string): Promise<any> {
    try {

      const searchResults = await this.taskModel.sequelize.query(
        `SELECT * FROM Tasks WHERE title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`,
        {
          type: QueryTypes.SELECT,
          model: Task,
        }
      );

      if (!searchResults || searchResults.length === 0) {
        throw new NotFoundException('No tasks found for the given keyword');
      }

      return { searchResults, status: "OK" };
    } catch (error) {
      throw new HttpException({ error: error.message ? error.message : error.errors[0].message }, HttpStatus.BAD_REQUEST)
    }
  }

  async sortTasks(sortBy: string, sortOrder: 'ASC' | 'DESC'): Promise<Task[]> {
    try {
      console.log('====================================');
      console.log(sortBy,' ',sortOrder);
      console.log('====================================');
      if(!['completed','dueDate','priority'].includes(sortBy)) throw {message:`sortBy: invalid value Please use one of 'completed','dueDate','priority'`};
      if(!['ASC', 'DESC'].includes(sortOrder)) throw {message:`sortOrder: invalid value Please use one of 'ASC', 'DESC'`};

      const order: OrderItem[] = [[sortBy, sortOrder]];
      return this.taskModel.findAll({ order });
    } catch (error) {
      throw new HttpException({ error: error.message ? error.message : error.errors[0].message, status:'ERROR' }, HttpStatus.BAD_REQUEST)
    }
  }

}

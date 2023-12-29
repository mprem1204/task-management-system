// nest-app/src/modules/task/controllers/task.controller.ts

import { Controller, Get, Post, Body, Param, Put, Patch, Delete, Query } from '@nestjs/common';
import { TaskService } from './tasks.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('admin/create-task')
  createTaskByAdmin(@Body() taskObj: any) {
    return this.taskService.createTask(taskObj);
  }

  @Put('admin/:taskId')
  editTaskByAdmin(@Param('taskId') taskId: number, @Body() taskObj: any) {
    return this.taskService.editTask(taskId, taskObj);
  }

  @Get('user/:userId')
  getUserTasks(@Param('userId') userId: number) {
    return this.taskService.getUserTasks(userId);
  }

  @Put('user/:userId/:taskId')
  markUserTaskAsComplete(@Param('userId') userId: number, @Param('taskId') taskId: number) {
    return this.taskService.markUserTaskAsComplete(userId, taskId);
  }

  @Get('admin/search/')
  searchTasksByAdmin(@Query('keyword') keyword: string) {
    return this.taskService.searchTasksByAdmin(keyword);
  }

  @Get('admin/sort/')
  async sortTasks(
    @Query('sortBy') sortBy: string,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
  ){
    return this.taskService.sortTasks(sortBy, sortOrder);
  }

}

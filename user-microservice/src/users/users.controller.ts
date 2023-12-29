import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import { createUserSchema } from './users.validation';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }


    @Post('/admin/create-user')
    async createAdminUser(@Body() userData: any): Promise<any> {
        return this.userService.createUser(userData);
    }

    @Get('/admin/fetch-all-users')
    async getAllUsersForAdmin(): Promise<any> {
          return this.userService.getAllUsersForAdmin()
    }

    @Get(':userId')
    async getUserInfo(@Param('userId') userId: number): Promise<string> {
        return this.userService.getUserInfo(userId);
    }

    @Delete('/admin/:userId')
    async deleteAdminUser(@Param('userId') userId: number) {
        return this.userService.deleteAdminUser(userId);
    }


}

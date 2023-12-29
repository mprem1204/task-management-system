import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { createUserSchema } from './users.validation';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) { }

    async validateRequestParams(schema: any, req_params: any) {
        try {
            const validate = await schema.validate(req_params)
        } catch (error) {
            throw error
        }
    }

    async createUser(userData: any): Promise<any> {
        try {
            await this.validateRequestParams(createUserSchema, userData);
            const new_user = await this.userModel.create({
                username: userData.username,
                email: userData.email,
                type: userData.type,
            });
            return {
                status:"OK",
                user_details: new_user
            };
        } catch (error) {
            throw new HttpException({ error: error.errors?.[0].message ? error.errors?.[0].message : error.errors?.[0], status:"ERROR" }, HttpStatus.BAD_REQUEST)
        }

    }

    async getAllUsersForAdmin(): Promise<any> {
        try {
            return this.userModel.findAll();
        } catch (error) {
            throw new HttpException({ error: error.errors[0].message ? error.errors[0].message : error.errors[0], status:"ERROR" }, HttpStatus.BAD_REQUEST);
        }
    }

    async getUserInfo(userId: number | string): Promise<any> {
        try {
            const user = await this.userModel.findByPk(userId);
            if (!user) {
                return {
                    status:"OK",
                    message: "User not found",
                    user_details: null
                };
            }
            return {
                status:"OK",
                user_details: user
            };
        } catch (error) {
            throw new HttpException({ error: error.errors[0].message ? error.errors[0].message : error.errors[0], status:"ERROR" }, HttpStatus.BAD_REQUEST);
        }
    }

    async deleteAdminUser(userId: number | string): Promise<any> {
        try {
            const deletedUser = await this.userModel.findByPk(userId);

            if (!deletedUser) {
                return 'User not found';
            }

            await deletedUser.destroy();
            return {
                status:"OK",
                message: 'user deleted successfully'};
        } catch (error) {
            throw new HttpException({ error: error.errors[0].message ? error.errors[0].message : error.errors[0], status:"ERROR" }, HttpStatus.BAD_REQUEST);
        }
    }

}

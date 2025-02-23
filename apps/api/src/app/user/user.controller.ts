import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDatabaseService } from './user.database.service';
import { FilterQuery } from 'mongoose';
import {
  IUser,
  IUserOptional,
} from '@employee-and-department-management-system/interfaces';
import { userQueryDto } from './dto/user-query.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userDatabaseService: UserDatabaseService) {}

  @Post()
  async createUsers(@Body() createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.userDatabaseService.addNewDocument({
      ...userData,
      password: hashedPassword,
    });
  }

  @Get()
  async findAllUsers(@Query() query: userQueryDto) {
    const options = { limit: query?.size ?? 10, skip: query?.start ?? 0 };
    console.log(query);
    const filters: FilterQuery<IUserOptional> = {};
    return await this.userDatabaseService.filterDocuments(filters, options);
  }

  @Get(':id')
  async findAUser(@Param('id') id: string) {
    return await this.userDatabaseService.findById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() requestBody: UpdateUserDto) {
    const foundUser = await this.userDatabaseService.findById(id);

    if (!foundUser) throw new NotFoundException('NOT_FOUND');

    const updateUser: IUser = {
      ...foundUser,
      ...requestBody,
    };

    return await this.userDatabaseService.updateDocument(updateUser);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userDatabaseService.hardDelete(id);
  }
}

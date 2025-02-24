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
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDatabaseService } from './user.database.service';
import { FilterQuery } from 'mongoose';
import {
  IUser,
  IUserOptional,
  IIdentity,
} from '@employee-and-department-management-system/interfaces';
import { userQueryDto } from './dto/user-query.dto';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { LoggedIdentity } from '../common/decorators/logged-identity.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userDatabaseService: UserDatabaseService) {}

  @Post()
  async createUsers(
    @Body() requestBody: CreateUserDto,
    @LoggedIdentity() loggedUser: IIdentity
  ) {
    const { password, ...userData } = requestBody;

    // Check if the email is already in use
    const existingUser = await this.userDatabaseService.findOneUser({
      username: requestBody?.username,
    });
    if (existingUser) {
      throw new ConflictException('Username is already in use');
    }

    // Check if the email is already in use
    const existingemail = await this.userDatabaseService.findOneUser({
      email: requestBody?.email,
    });
    if (existingemail) {
      throw new ConflictException('Email is already in use');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.userDatabaseService.addNewDocument(
      {
        ...userData,
        password: hashedPassword,
      },
      {
        created_by: loggedUser._id?.toString(),
      }
    );
  }

  @Get()
  async findAllUsers(
    @LoggedIdentity() loggedUser: IIdentity,
    @Query() query: userQueryDto
  ) {
    const options = { limit: query?.size ?? 10, skip: query?.start ?? 0 };
    console.log(query);
    const filters: FilterQuery<IUserOptional> = {};
    return await this.userDatabaseService.filterPaginatedDocumentsWithCount(
      filters,
      options
    );
  }

  @Get(':id')
  async findAUser(@Param('id') params: { id: string }) {
    return await this.userDatabaseService.findById(params?.id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') params: { id: string },
    @Body() requestBody: UpdateUserDto,
    @LoggedIdentity() loggedUser: IIdentity
  ) {
    const foundUser = await this.userDatabaseService.findById(params?.id);

    if (!foundUser) throw new NotFoundException('NOT_FOUND');

    const updateUser: IUser = {
      ...foundUser,
      ...requestBody,
    };

    return await this.userDatabaseService.updateDocument(updateUser, {
      created_by: loggedUser._id?.toString(),
    });
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') params: { id: string },
    @LoggedIdentity() loggedUser: IIdentity
  ) {
    const foundUser = await this.userDatabaseService.findById(params?.id);

    if (!foundUser) throw new NotFoundException('NOT_FOUND');

    return await this.userDatabaseService.hardDelete(params?.id, {
      created_by: loggedUser._id?.toString(),
    });
  }
}

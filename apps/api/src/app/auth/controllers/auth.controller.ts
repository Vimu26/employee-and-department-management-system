import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';
import { AuthDatabaseService } from '../services/auth.database.service';
import { userQueryDto } from '../../user/dto/user-query.dto';
import { LoginUserDto } from '../dtos/login.request.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IIdentity } from '@employee-and-department-management-system/interfaces';
import { LoggedIdentity } from '../../common/decorators/logged-identity.decorator';
import { ResponseService } from '../../common/services/response.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authDatabaseService: AuthDatabaseService,
    public responseService: ResponseService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Query() queryParams: userQueryDto) {
    try {
      const users = await this.authDatabaseService.getUsers(queryParams);
      return this.responseService.successResponse(
        200,
        'Users fetched successfully',
        users
      );
    } catch (error) {
      console.log(error);
      return this.responseService.errorResponse(error?.response);
    }
  }

  // Register a new user
  @Post('register')
  async registerUser(
    @Body() requestBody: CreateUserDto,
    @LoggedIdentity() loggedUser: IIdentity
  ) {
    try {
      const newUser = await this.authDatabaseService.registerUser(
        requestBody,
        loggedUser
      );
      return this.responseService.successResponse(
        201,
        'User registered successfully',
        newUser
      );
    } catch (error) {
      console.log(error);
      return this.responseService.errorResponse(error?.response);
    }
  }

  // Login a user
  @Post('login')
  async loginUser(@Body() requestBody: LoginUserDto) {
    try {
      const loginResponse = await this.authDatabaseService.loginUser(
        requestBody
      );
      return this.responseService.successResponse(
        200,
        'Login successful',
        loginResponse
      );
    } catch (error) {
      return this.responseService.errorResponse(error?.response);
    }
  }
}

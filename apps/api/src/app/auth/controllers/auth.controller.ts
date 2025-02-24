import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';
import { AuthDatabaseService } from '../services/auth.database.service';
import { userQueryDto } from '../../user/dto/user-query.dto';
import { LoginUserDto } from '../dtos/login.request.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { IIdentity } from '@employee-and-department-management-system/interfaces';
import { LoggedIdentity } from '../../common/decorators/logged-identity.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authDatabaseService: AuthDatabaseService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Query() queryParams: userQueryDto) {
    return await this.authDatabaseService.getUsers(queryParams);
  }

  @Post('register')
  async registerUser(
    @Body() requestBody: CreateUserDto,
    @LoggedIdentity() loggedUser: IIdentity
  ) {
    return await this.authDatabaseService.registerUser(requestBody, loggedUser);
  }

  @Post('login')
  async loginUser(@Body() requestBody: LoginUserDto) {
    return await this.authDatabaseService.loginUser(requestBody);
  }
}

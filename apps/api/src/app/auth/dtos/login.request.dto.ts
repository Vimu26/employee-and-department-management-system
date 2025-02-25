import { ILogin } from '@employee-and-department-management-system/interfaces';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto implements ILogin {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

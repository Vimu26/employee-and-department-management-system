import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  AuthResponse,
  IUserOptional,
  IIdentity,
} from '@employee-and-department-management-system/interfaces';
import { UserModel } from '../../user/user.model';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { HashingService } from './hashing.service';
import { userQueryDto } from '../../user/dto/user-query.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { LoginUserDto } from '../dtos/login.request.dto';

@Injectable()
export class AuthDatabaseService {
  constructor(
    @InjectModel(DB_COLLECTION_NAMES.USERS)
    private readonly usersModel: Model<UserModel>,
    private jwtService: JwtService,
    private passwordHashingService: HashingService
  ) {}

  async getUsers(queryParams: userQueryDto) {
    const filters: FilterQuery<IUserOptional> = {};

    if (queryParams._id) {
      filters._id = queryParams._id; // Match with _id field
    }
    return await this.usersModel.find(filters);
  }

  async findById(id: string): Promise<IIdentity> {
    const user = await this.usersModel.findById(id);
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Return user data without the password
    return userWithoutPassword;
  }

  async registerUser(data: CreateUserDto,loggedIdentity : IIdentity): Promise<IIdentity> {
    const { name, email, password, role, address, username } = data;

    // Check if the email is already in use
    const existingUser = await this.usersModel.findOne({ username });
    if (existingUser) {
      throw new ConflictException('Username is already in use');
    }

    // Check if the email is already in use
    const existingemail = await this.usersModel.findOne({ email });
    if (existingemail) {
      throw new ConflictException('Email is already in use');
    }

    // Hash the password
    const hashedPassword = await this.passwordHashingService.hashPassword(
      password
    );

    // Create a new user
    const newUser = new this.usersModel({
      name,
      email,
      username,
      password: hashedPassword,
      role,
      address,
      created_by : loggedIdentity?._id?.toString()
    });

    // Save the user to the database
    const user = await newUser.save();

    // Remove password before returning (for security)
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Return user data without the password
    return userWithoutPassword;
  }

  async loginUser(data: LoginUserDto): Promise<AuthResponse> {
    const { username, password } = data;

    const user = await this.usersModel.findOne({ username });

    //Compare Password
    if (
      !user ||
      !(await this.passwordHashingService.comparePassword(
        password,
        user.password
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });
    return { user: user, token };
  }
}

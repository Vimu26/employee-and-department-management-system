import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeDatabaseService } from './employee.database.service';
import {
  IEmployee,
  IEmployeeOptional,
  IIdentity,
} from '@employee-and-department-management-system/interfaces';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { LoggedIdentity } from '../common/decorators/logged-identity.decorator';
import { FilterQuery } from 'mongoose';
import { EmployeeQueryDto } from './dto/employee.query.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(
    private readonly employeeDatabaseService: EmployeeDatabaseService
  ) {}

  @Post()
  async createEmployee(
    @Body() employeeData: IEmployee,
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IEmployee> {
    return this.employeeDatabaseService.addNewDocument(employeeData, {
      created_by: loggedUser._id?.toString(),
    });
  }

  @Get()
  async findAllEmployees(
    @LoggedIdentity() loggedUser: IIdentity,
    @Query() query: EmployeeQueryDto
  ): Promise<IEmployee[]> {
    const options = { limit: query?.size ?? 10, skip: query?.start ?? 0 };
    console.log(query);
    const filters: FilterQuery<IEmployeeOptional> = {};
    return await this.employeeDatabaseService.filterDocuments(filters, options);
  }

  @Get(':id')
  async getEmployee(
    @Param('id') params: { id: string }
  ): Promise<IEmployee | null> {
    return this.employeeDatabaseService.findById(params?.id);
  }

  @Patch(':id')
  async updateEmployee(
    @Param('id') params: { id: string },
    @Body() requestBody: UpdateEmployeeDto,
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IEmployee | null> {
    const foundEmployee = await this.employeeDatabaseService.findById(
      params?.id
    );

    if (!foundEmployee) throw new NotFoundException('NOT_FOUND');

    const updatedEmployee: IEmployee = {
      ...foundEmployee,
      ...requestBody,
    };

    return this.employeeDatabaseService.updateDocument(updatedEmployee, {
      created_by: loggedUser._id?.toString(),
    });
  }

  @Delete(':id')
  async deleteEmployee(
    @Param('id') params: { id: string },
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IEmployee | null> {
    const foundUser = await this.employeeDatabaseService.findById(params?.id);

    if (!foundUser) throw new NotFoundException('NOT_FOUND');

    return await this.employeeDatabaseService.hardDelete(params?.id, {
      created_by: loggedUser._id?.toString(),
    });
  }
}

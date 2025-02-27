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
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeDatabaseService } from './employee.database.service';
import {
  CommonResponse,
  IEmployee,
  IEmployeeOptional,
  IIdentity,
} from '@employee-and-department-management-system/interfaces';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { LoggedIdentity } from '../common/decorators/logged-identity.decorator';
import { FilterQuery } from 'mongoose';
import { EmployeeQueryDto } from './dto/employee.query.dto';
import { ResponseService } from '../common/services/response.service';
import { EMPLOYEE_STATUS } from '@employee-and-department-management-system/enums';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(
    private readonly employeeDatabaseService: EmployeeDatabaseService,
    public responseService: ResponseService
  ) {}

  @Post()
  async createEmployee(
    @Body() requestBody: CreateEmployeeDto,
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IEmployee> {
    const emp_no = await this.employeeDatabaseService.generateEmployeeId();
    const generatedEmployee: IEmployee = {
      ...requestBody,
      status: EMPLOYEE_STATUS.ACTIVE,
      employee_id: emp_no?.employee_id,
      epf_no: !requestBody?.epf_no ? null : requestBody?.epf_no,
    };
    return await this.employeeDatabaseService.addNewDocument(
      generatedEmployee,
      {
        created_by: loggedUser._id?.toString(),
      }
    );
  }

  @Get()
  async findAllEmployees(
    @LoggedIdentity() loggedUser: IIdentity,
    @Query() query: EmployeeQueryDto
  ): Promise<CommonResponse<IEmployee[]>> {
    const options = { limit: query?.size, skip: query?.start };
    console.log(query);
    const filters: FilterQuery<IEmployeeOptional> = {};

    if (query?._id) {
      filters['_id'] = query._id;
    }

    if (query?.name) {
      filters['name'] = { $regex: query.name, $options: 'i' };
    }

    if (query?.address) {
      filters['address'] = { $regex: query.address, $options: 'i' };
    }

    if (query?.epf_no) {
      filters['epf_no'] = query.epf_no;
    }

    if (query?.employee_id) {
      filters['employee_id'] = query.employee_id;
    }

    if (query?.nic) {
      filters['nic'] = query.nic;
    }

    if (query?.status) {
      filters['status'] = query.status;
    }

    if (query?.email) {
      filters['email'] = { $regex: query.email, $options: 'i' };
    }

    if (query?.phone) {
      filters['phone'] = query.phone;
    }

    if (query?.position) {
      filters['position'] = query.position;
    }

    if (query?.department_id) {
      filters['department_id'] = query.department_id;
    }

    console.log('Employee Query Filters:', filters);

    const docs =
      await this.employeeDatabaseService.filterPaginatedDocumentsWithCount(
        filters,
        options
      );

    return this.responseService.paginatedResponse(docs);
  }

  @Get(':id')
  async getEmployee(
    @Param() params: { id: string }
  ): Promise<CommonResponse<IEmployee | null>> {
    const docs = await this.employeeDatabaseService.findById(params?.id);
    return { data: docs };
  }

  @Get('generate/emp-no')
  async generateEmployeeId(): Promise<CommonResponse<{ employee_id: string }>> {
    const docs = await this.employeeDatabaseService.generateEmployeeId();
    return { data: docs };
  }

  @Patch(':id')
  async updateEmployee(
    @Param() params: { id: string },
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
    @Param() params: { id: string },
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IEmployee | null> {
    const foundUser = await this.employeeDatabaseService.findById(params?.id);

    if (!foundUser) throw new NotFoundException('NOT_FOUND');

    return await this.employeeDatabaseService.hardDelete(params?.id, {
      created_by: loggedUser._id?.toString(),
    });
  }
}

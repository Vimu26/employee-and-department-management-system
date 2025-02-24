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
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentDatabaseService } from './department.database.service';
import {
  IDepartment,
  IIdentity,
} from '@employee-and-department-management-system/interfaces';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { LoggedIdentity } from '../common/decorators/logged-identity.decorator';
import { FilterQuery } from 'mongoose';
import { DepartmentQueryDto } from './dto/department.query.dto';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(
    private readonly departmentDatabaseService: DepartmentDatabaseService
  ) {}

  @Post()
  async createDepartment(
    @Body() requestBody: CreateDepartmentDto,
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IDepartment> {
    return this.departmentDatabaseService.addNewDocument(
      {
        ...requestBody,
        created_by: loggedUser._id?.toString(),
      },
      {
        created_by: loggedUser._id?.toString(),
      }
    );
  }

  @Get()
  async findAllDepartments(
    @LoggedIdentity() loggedUser: IIdentity,
    @Query() query: DepartmentQueryDto
  ): Promise<IDepartment[]> {
    const options = { limit: query?.size ?? 10, skip: query?.start ?? 0 };
    const filters: FilterQuery<IDepartment> = {};
    return await this.departmentDatabaseService.filterDocuments(
      filters,
      options
    );
  }

  @Get(':id')
  async getDepartment(
    @Param('id') params: { id: string }
  ): Promise<IDepartment | null> {
    return this.departmentDatabaseService.findById(params?.id);
  }

  @Patch(':id')
  async updateDepartment(
    @Param('id') params: { id: string },
    @Body() requestBody: UpdateDepartmentDto,
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IDepartment | null> {
    const foundDepartment = await this.departmentDatabaseService.findById(
      params?.id
    );

    if (!foundDepartment) throw new NotFoundException('NOT_FOUND');

    const updatedDepartment: IDepartment = {
      ...foundDepartment,
      ...requestBody,
    };

    return this.departmentDatabaseService.updateDocument(updatedDepartment, {
      created_by: loggedUser._id?.toString(),
    });
  }

  @Delete(':id')
  async deleteDepartment(
    @Param('id') params: { id: string },
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IDepartment | null> {
    const foundDepartment = await this.departmentDatabaseService.findById(
      params?.id
    );

    if (!foundDepartment) throw new NotFoundException('NOT_FOUND');

    return await this.departmentDatabaseService.hardDelete(params?.id, {
      created_by: loggedUser._id?.toString(),
    });
  }
}

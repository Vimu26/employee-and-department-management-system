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
  CommonResponse,
  IDepartment,
  IIdentity,
} from '@employee-and-department-management-system/interfaces';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { LoggedIdentity } from '../common/decorators/logged-identity.decorator';
import { FilterQuery } from 'mongoose';
import { DepartmentQueryDto } from './dto/department.query.dto';
import { ResponseService } from '../common/services/response.service';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(
    private readonly departmentDatabaseService: DepartmentDatabaseService,
    public responseService: ResponseService
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
  ): Promise<CommonResponse<IDepartment[]>> {
    const options = { limit: query?.size ?? 10, skip: query?.start ?? 0 };
    const filters: FilterQuery<IDepartment> = {};
    if (query?.name) {
      filters['name'] = { $regex: query.name, $options: 'i' };
    }

    if (query?.type) {
      filters['type'] = query.type;
    }

    if (query?._id) {
      filters['_id'] = query._id;
    }

    const docs =
      await this.departmentDatabaseService.filterPaginatedDocumentsWithCount(
        filters,
        options
      );
    return this.responseService.paginatedResponse(docs);
  }

  @Get(':id')
  async getDepartment(
    @Param() params: { id: string }
  ): Promise<CommonResponse<IDepartment>> {
    const results = await this.departmentDatabaseService.findById(params?.id);
    return { data: results };
  }

  @Patch(':id')
  async updateDepartment(
    @Param() params: { id: string },
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
      _id : foundDepartment?._id
    };

    return this.departmentDatabaseService.updateDocument(updatedDepartment, {
      created_by: loggedUser._id?.toString(),
    });
  }

  @Delete(':id')
  async deleteDepartment(
    @Param() params: { id: string },
    @LoggedIdentity() loggedUser: IIdentity
  ): Promise<IDepartment | null> {
    console.log(params.id);
    const foundDepartment = await this.departmentDatabaseService.findById(
      params?.id
    );

    if (!foundDepartment) throw new NotFoundException('NOT_FOUND');

    return await this.departmentDatabaseService.hardDelete(params?.id, {
      created_by: loggedUser._id?.toString(),
    });
  }
}

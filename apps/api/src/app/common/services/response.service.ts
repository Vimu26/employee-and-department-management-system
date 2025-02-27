// response.service.ts
import { CommonResponse } from '@employee-and-department-management-system/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  successResponse<T>(
    statusCode: number,
    message: string,
    data: T,
    count?: number
  ): CommonResponse<T> {
    return {
      statusCode,
      message,
      success: true,
      data,
      count,
    };
  }

  errorResponse<T>(error: any): CommonResponse<T> {
    return {
      statusCode: error?.statusCode,
      message: error?.message,
      success: false,
      data: null,
    };
  }

  paginatedResponse<T>(data: any): CommonResponse<T> {
    return {
      statusCode: 200,
      message: '',
      success: true,
      data: data?.data,
      count: data?.total,
    };
  }
}

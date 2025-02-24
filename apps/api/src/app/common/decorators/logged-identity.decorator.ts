import { IIdentity } from '@employee-and-department-management-system/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedIdentity = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IIdentity | null => {
    const request = ctx.switchToHttp().getRequest();
    return (request.user as IIdentity) || null;
  }
);

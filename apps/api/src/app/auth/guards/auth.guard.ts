import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDatabaseService } from '../services/auth.database.service';
import { IIdentity } from '@employee-and-department-management-system/interfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authDatabaseService: AuthDatabaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization token is missing or malformed'
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      // Decode the token
      const decoded = this.jwtService.verify(token);

      const user: IIdentity = await this.authDatabaseService.findById(
        decoded.sub
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user as IIdentity;

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      throw new UnauthorizedException('Invalid token');
    }
  }
}

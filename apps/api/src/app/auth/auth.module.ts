import { Global, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthDatabaseService } from './services/auth.database.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../user/user.model';
import { DB_COLLECTION_NAMES } from '@employee-and-department-management-system/enums';
import { JwtAuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';
import { HashingService } from './services/hashing.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: DB_COLLECTION_NAMES.USERS, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthDatabaseService, HashingService, PublicGuard, JwtAuthGuard],
  exports: [
    JwtModule,
    PassportModule,
    PublicGuard,
    JwtAuthGuard,
    AuthDatabaseService,
  ],
})
export class AuthModule {}

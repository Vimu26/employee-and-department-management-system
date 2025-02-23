import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class HashingService {
  hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcryptjs.genSalt(saltRounds);
    const hashPassword = await bcryptjs.hash(password, salt);
    return hashPassword;
  };

  comparePassword = async (password: string, hashPassword: string) => {
    return bcryptjs.compare(password, hashPassword);
  };
}

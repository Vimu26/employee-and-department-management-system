import { Controller } from '@nestjs/common';
import { CommonDatabaseService } from '../services/common.database.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonDatabaseService: CommonDatabaseService) {}
}

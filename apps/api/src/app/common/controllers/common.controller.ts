import { Controller } from '@nestjs/common';
import { CommonService } from '../services/common.database.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}
}

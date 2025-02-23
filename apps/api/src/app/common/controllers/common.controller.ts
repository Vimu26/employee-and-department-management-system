import { Controller } from '@nestjs/common';
import { CommonService } from '../services/common.databse.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}
}

import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { AppService } from '@modules/app/app.service';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health-check')
  sayHello() {
    return this.appService.healthCheck();
  }
}

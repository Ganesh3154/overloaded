import { Controller, Get } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}
  @Get()
  async getCompanies() {
    return await this.companyService.find();
  }
}

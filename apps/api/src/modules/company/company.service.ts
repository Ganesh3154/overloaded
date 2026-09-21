import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CompanyService {
  constructor(private db: DatabaseService) {}
  async find() {
    return await this.db.company.findMany();
  }
}

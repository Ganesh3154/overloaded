import { Injectable } from '@nestjs/common';
import type { OnboardingInput } from '@overloaded/shared';
import { DatabaseService } from '../../database/database.service';
import { CreateUserDto } from 'src/modules/user/dto/user.dto';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    private logger: LoggerService,
    private db: DatabaseService,
  ) {}

  async createUser(user: CreateUserDto) {
    return await this.db.user.create({
      data: {
        fullName: user.fullName,
        email: user.email,
        password: user.password,

        isDeleted: false,
      },
    });
  }

  async find(
    query: {
      id?: number;
      username?: string;
      fullName?: string;
      email?: string;
    },
    includePassword: boolean = false,
  ) {
    return await this.db.user.findUnique({
      where: {
        id: query.id,
        email: query.email,
        fullName: query.fullName,
      },
      omit: { password: !includePassword },
      include: {
        targetCompanies: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async updateByUid(
    uid: string,
    { targetCompanies, ...data }: OnboardingInput,
  ) {
    this.logger.info(`Updating user: ${uid} with ${JSON.stringify(data)}`);

    return await this.db.user.update({
      where: {
        uid,
      },
      data: {
        isOnboarded: true,
        targetCompanies: {
          create: targetCompanies.map((companyId) => ({ companyId })),
        },
        ...data,
      },
    });
  }
}

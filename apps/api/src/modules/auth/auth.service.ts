import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginCredentialDto, RegisterCredentialDto } from './dto/auth.dto';
import { CreateUserDto } from '../user/dto/user.dto';
import { hashPassword, verifyPassword } from 'src/helpers/crypto';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private logger: LoggerService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(credential: RegisterCredentialDto) {
    const hashedPassword = await hashPassword(credential.password);

    const user: CreateUserDto = {
      email: credential.email,
      fullName: credential.fullName,
      password: hashedPassword,
    };

    const createdUser = await this.userService.createUser(user);
    this.logger.info(`User registered ${createdUser}`);

    const data = await this.login(credential);
    return data;
  }

  async login(credential: LoginCredentialDto) {
    const user = await this.userService.find({ email: credential.email }, true);
    if (!user || !(await verifyPassword(credential.password, user.password))) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const accessToken = this.jwtService.sign({
      sub: user.uid,
      uid: user.uid,
      username: user.username,
      email: user.email,
      id: user.id,
    });

    const data = { ...user, accessToken };
    this.logger.info(`User logged in ${data}`);

    return data;
  }
}

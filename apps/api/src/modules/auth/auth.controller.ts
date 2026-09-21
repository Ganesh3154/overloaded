import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@overloaded/shared';
import { Public } from 'src/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) credential: RegisterInput,
  ) {
    return await this.authService.register(credential);
  }

  @Public()
  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) credential: LoginInput,
  ) {
    return await this.authService.login(credential);
  }
}

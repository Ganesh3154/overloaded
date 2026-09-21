import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentialDto, RegisterCredentialDto } from './dto/auth.dto';
import { Public } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('register')
  async register(@Body() credential: RegisterCredentialDto) {
    return await this.authService.register(credential);
  }

  @Public()
  @Post('login')
  async login(@Body() credential: LoginCredentialDto) {
    return await this.authService.login(credential);
  }
}

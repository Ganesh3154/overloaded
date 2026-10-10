import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@overloaded/shared';
import { Public } from 'src/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

const GOOGLE_STATE_COOKIE = 'google_oauth_state';

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

  @Public()
  @Get('google/url')
  googleUrl(@Res({ passthrough: true }) res: Response) {
    const { url, state } = this.authService.getGoogleAuthUrl();

    res.cookie(GOOGLE_STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 5 * 60 * 1000,
      path: '/api/v1/auth/google',
    });

    return { url };
  }

  @Public()
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    const expectedState = (req.cookies as Record<string, string> | undefined)?.[
      GOOGLE_STATE_COOKIE
    ];
    res.clearCookie(GOOGLE_STATE_COOKIE, { path: '/api/v1/auth/google' });

    if (error) {
      return res.redirect(`${frontendUrl}/login?error=google_oauth_denied`);
    }

    if (!code || !state || !expectedState || state !== expectedState) {
      return res.redirect(
        `${frontendUrl}/login?error=google_oauth_invalid_state`,
      );
    }

    try {
      const data = await this.authService.googleLogin(code);
      const params = new URLSearchParams({
        accessToken: data.accessToken,
        isOnboarded: String(data.isOnboarded),
      });
      return res.redirect(
        `${frontendUrl}/auth/google/callback#${params.toString()}`,
      );
    } catch {
      return res.redirect(`${frontendUrl}/login?error=google_oauth_failed`);
    }
  }
}

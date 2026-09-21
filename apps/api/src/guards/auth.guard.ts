import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/logger/logger.service';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export interface JwtPayload {
  sub: string;
  uid: string;
  username: string | null;
  email: string;
  id: number;
  aud?: string;
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private logger: LoggerService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return this.validateReqeust(request);
  }

  validateReqeust(request: AuthenticatedRequest) {
    const accessToken = (request.headers['authorization'] as string)?.split(
      'Bearer ',
    )[1];
    if (!accessToken) {
      this.logger.warn('Access token not found');
      throw new UnauthorizedException('Invalid access token');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(accessToken);
      if (payload.aud !== process.env.JWT_AUD)
        throw new UnauthorizedException('Invalid access token');

      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    return true;
  }
}

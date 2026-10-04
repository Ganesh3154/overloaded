import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UserService } from '../user/user.service';
import type { LoginInput, RegisterInput } from '@overloaded/shared';
import { CreateUserDto } from '../user/dto/user.dto';
import { hashPassword, verifyPassword } from 'src/helpers/crypto';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/logger/logger.service';

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_ENDPOINT =
  'https://www.googleapis.com/oauth2/v3/userinfo';

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  id_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private logger: LoggerService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(credential: RegisterInput) {
    const hashedPassword = await hashPassword(credential.password);

    const user: CreateUserDto = {
      email: credential.email,
      fullName: credential.fullName,
      password: hashedPassword,
    };

    const createdUser = await this.userService.createUser(user);
    this.logger.info(`User registered ${createdUser.id}`);

    const data = await this.login(credential);
    return data;
  }

  async login(credential: LoginInput) {
    const user = await this.userService.find({ email: credential.email }, true);
    if (
      !user?.password ||
      !(await verifyPassword(credential.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const data = { ...user, accessToken: this.signAccessToken(user) };
    this.logger.info(`User logged in ${data.id}`);

    return data;
  }

  getGoogleAuthUrl() {
    const state = randomBytes(16).toString('hex');

    const params = new URLSearchParams({
      client_id: this.getGoogleEnv('GOOGLE_CLIENT_ID'),
      redirect_uri: this.getGoogleEnv('GOOGLE_REDIRECT_URI'),
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      state,
    });

    return { url: `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`, state };
  }

  async googleLogin(code: string) {
    const { access_token: googleAccessToken } =
      await this.exchangeGoogleCode(code);
    const googleUser = await this.fetchGoogleUserInfo(googleAccessToken);

    if (!googleUser.email_verified) {
      throw new UnauthorizedException('Google email is not verified');
    }

    const user = await this.findOrCreateGoogleUser(googleUser);

    const data = { ...user, accessToken: this.signAccessToken(user) };
    this.logger.info(`User logged in via Google ${data.id}`);

    return data;
  }

  private async findOrCreateGoogleUser(googleUser: GoogleUserInfo) {
    const existingByGoogleId = await this.userService.findByGoogleId(
      googleUser.sub,
    );
    if (existingByGoogleId) return existingByGoogleId;

    const existingByEmail = await this.userService.find(
      { email: googleUser.email },
      false,
    );
    if (existingByEmail) {
      return await this.userService.linkGoogleAccount(
        existingByEmail.uid,
        googleUser.sub,
      );
    }

    const createdUser = await this.userService.createGoogleUser({
      email: googleUser.email,
      fullName: googleUser.name ?? googleUser.email,
      googleId: googleUser.sub,
    });
    this.logger.info(`User registered via Google ${createdUser.id}`);
    return createdUser;
  }

  private signAccessToken(user: {
    uid: string;
    username: string | null;
    email: string;
    id: number;
  }) {
    return this.jwtService.sign({
      sub: user.uid,
      uid: user.uid,
      username: user.username,
      email: user.email,
      id: user.id,
    });
  }

  private async exchangeGoogleCode(code: string): Promise<GoogleTokenResponse> {
    const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.getGoogleEnv('GOOGLE_CLIENT_ID'),
        client_secret: this.getGoogleEnv('GOOGLE_CLIENT_SECRET'),
        redirect_uri: this.getGoogleEnv('GOOGLE_REDIRECT_URI'),
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      this.logger.warn(
        `Google token exchange failed: ${await response.text()}`,
      );
      throw new UnauthorizedException('Invalid Google authorization code');
    }

    return (await response.json()) as GoogleTokenResponse;
  }

  private async fetchGoogleUserInfo(
    accessToken: string,
  ): Promise<GoogleUserInfo> {
    const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      this.logger.warn(
        `Google userinfo fetch failed: ${await response.text()}`,
      );
      throw new UnauthorizedException('Failed to fetch Google profile');
    }

    return (await response.json()) as GoogleUserInfo;
  }

  private getGoogleEnv(
    name: 'GOOGLE_CLIENT_ID' | 'GOOGLE_CLIENT_SECRET' | 'GOOGLE_REDIRECT_URI',
  ) {
    const value = process.env[name];
    if (!value) {
      throw new InternalServerErrorException(`${name} is not configured`);
    }
    return value;
  }
}

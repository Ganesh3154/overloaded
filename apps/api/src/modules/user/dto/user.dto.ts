import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  id?: number;
  uid?: string;

  @IsString()
  username?: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsStrongPassword()
  password!: string;

  isDeleted?: boolean;
}

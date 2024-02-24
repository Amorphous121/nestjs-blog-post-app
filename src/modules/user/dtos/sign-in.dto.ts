import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: String,
    description: 'Email of user.',
    example: 'pratham@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of user.',
    example: 'Password@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

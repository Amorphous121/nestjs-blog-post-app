import { ApiProperty } from '@nestjs/swagger';

export class ConflictResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'User with email already exists!',
  })
  message: string;

  @ApiProperty({
    description: 'Error',
    example: 'Conflict',
  })
  error: string;
}

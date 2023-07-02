import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Contend of comment.', example: 'Test comment.' })
  text: string;
}

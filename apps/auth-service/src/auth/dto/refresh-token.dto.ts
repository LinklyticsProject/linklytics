import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token issued during login/refresh',
    example: 'c1d2e3f4...random...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

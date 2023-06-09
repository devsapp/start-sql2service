import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateUserDto {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  avatar: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  intro: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;


  created_at: string;

  updated_at: string;
}

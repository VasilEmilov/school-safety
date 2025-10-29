// backend/src/reports/dto/create-report.dto.ts
import { IsDateString, IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @MaxLength(5000)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  category?: string;

  @IsOptional()
  @IsDateString()
  incidentDate?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsPhoneNumber('US')
  contactPhone?: string;
}

// backend/src/reports/reports.controller.ts
import type { Express } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('public/:schoolSlug')
  @UseInterceptors(
    FilesInterceptor('attachments', 5, {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async createPublicReport(
    @Param('schoolSlug') schoolSlug: string,
    @Body() dto: CreateReportDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    return this.reportsService.createReport(schoolSlug, dto, files || []);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.OVERSEER, Role.SCHOOL_ADMIN)
  async listReports(@Req() req: any) {
    return this.reportsService.listReportsForUser(req.user);
  }
}

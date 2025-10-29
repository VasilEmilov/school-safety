// backend/src/reports/reports.service.ts
import type { Express } from 'express';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { StorageService } from '../storage/storage.service';
import { Role } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService, private readonly storageService: StorageService) {}

  async createReport(schoolSlug: string, dto: CreateReportDto, files: Express.Multer.File[]) {
    const school = await this.prisma.school.findUnique({ where: { slug: schoolSlug } });
    if (!school) {
      throw new NotFoundException('School not found');
    }

    const report = await this.prisma.report.create({
      data: {
        schoolId: school.id,
        description: dto.description,
        category: dto.category,
        incidentDate: dto.incidentDate ? new Date(dto.incidentDate) : undefined,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        attachments: {
          create: await Promise.all(
            (files || []).map(async (file) => {
              const stored = await this.storageService.save(file, school.slug);
              return {
                filename: stored.filename,
                mimetype: stored.mimetype,
                size: stored.size,
                path: stored.path,
              };
            }),
          ),
        },
      },
      include: {
        attachments: true,
        school: true,
      },
    });

    return report;
  }

  async listReportsForUser(user: { role: Role; schoolId?: string }) {
    if (user.role === Role.OVERSEER) {
      return this.prisma.report.findMany({
        orderBy: { createdAt: 'desc' },
        include: { attachments: true, school: true },
      });
    }

    if (user.role === Role.SCHOOL_ADMIN && user.schoolId) {
      return this.prisma.report.findMany({
        where: { schoolId: user.schoolId },
        orderBy: { createdAt: 'desc' },
        include: { attachments: true, school: true },
      });
    }

    throw new NotFoundException('Reports not available for user');
  }
}

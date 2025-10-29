// backend/src/storage/storage.service.ts
import type { Express } from 'express';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', join(process.cwd(), 'uploads'));
  }

  async save(file: Express.Multer.File, schoolSlug: string) {
    const schoolDir = join(this.uploadDir, schoolSlug);
    await fs.mkdir(schoolDir, { recursive: true });
    const extension = file.originalname.split('.').pop();
    const filename = `${randomUUID()}${extension ? `.${extension}` : ''}`;
    const filePath = join(schoolDir, filename);

    try {
      await fs.writeFile(filePath, file.buffer);
      return {
        filename,
        mimetype: file.mimetype,
        size: file.size,
        path: filePath,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to store attachment');
    }
  }
}

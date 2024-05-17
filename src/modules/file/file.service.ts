import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { AllConfigType } from 'src/config/config.type';
import { CreateFileDto } from './dto/create-file.dto';
import path from 'path';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileService {

  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.configService.getOrThrow('file.r2Endpoint', { infer: true }),
      region: this.configService.getOrThrow('file.r2Region', { infer: true }),
      credentials: {
        accessKeyId: this.configService.getOrThrow('file.r2AccessKeyId', { infer: true }),
        secretAccessKey: this.configService.getOrThrow('file.r2SecretAccessKey', { infer: true }),
      },
    });
  }

  create(createFile: CreateFileDto): Promise<FileEntity> {
    return this.fileRepository.save(
      this.fileRepository.create(createFile),
    );
  }

  async generatePresignedUrl(
    fileName: string,
    mimeType: string,
    folder?: string,
  ): Promise<any> {
    console.log(mimeType);

    const fileExtension = path.extname(fileName); // Extrai a extensão do arquivo
    const FileName = `${Date.now()}-${path.basename(
      fileName,
      fileExtension,
    )}${fileExtension}`; // Gera um nome de arquivo único incluindo a extensão

    const bucket = this.configService.get('file.r2Bucket', { infer: true });
    const key = folder ? `${folder}/${FileName}` : FileName;

    //Todo: Criar validação de nome de pasta para aceitar apenas (receipts, accidents)

    if (!bucket) {
      return { status: "error", error: 'Bucket was not informed' };
    }

    const file = await this.create({
      bucket: bucket,
      key: key,
    });

    console.log(file);
    const fileId = file.id;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      }); // URL expira em 1 hora
      return { url, key, fileId };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: {
            message: 'Failed to generate presigned URL',
            detail: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPresignedUrl(id: string) {
    const file = await this.fileRepository.findOne({
      where: { id: id },
    });

    console.log(file);

    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const command = new GetObjectCommand({
      Bucket: file.bucket,
      Key: file.key,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 3600,
      }); // URL expira em 1 hora
      return { url };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: {
            message: 'Failed to generate presigned URL',
            detail: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

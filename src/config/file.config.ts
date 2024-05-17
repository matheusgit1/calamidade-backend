import { registerAs } from '@nestjs/config';
import { FileConfig } from './config.type';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {

  @IsString()
  R2_REGION: string;

  @IsString()
  R2_ENDPOINT: string;

  @IsString()
  R2_ACCESS_KEY_ID: string;

  @IsString()
  R2_SECRET_ACCESS_KEY: string;

  @IsString()
  @IsOptional()
  R2_BUCKET: string;


}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    r2Region: process.env.R2_REGION,
    r2Endpoint: process.env.R2_ENDPOINT,
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID,
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    r2Bucket: process.env.R2_BUCKET,
    maxFileSize: 5242880, // 5mb
  };
});

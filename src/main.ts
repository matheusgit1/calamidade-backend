import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { useContainer } from "class-validator";
import { AllConfigType } from "./config/config.type";
import { AppModule } from "./modules/app/app.module";
import validationOptions from "./utils/validation-options";
import { CustomExceptionFilter } from "./infrastructure/filters/custom-exception-filter";

interface AppBootStrap {
  app: INestApplication;
  config: ConfigService;
}

export async function bootstrap(): Promise<AppBootStrap> {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    cors: true,
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const config = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(config.getOrThrow("app.apiPrefix", { infer: true }), {
    exclude: ["/"],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  //app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new LoggingInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  /**
   * use in case of implementing trace via aws xray
   */
  // app.use(AWSXray.express.openSegment(process.env.APP_NAME || 'calamidade-backend));

  return { app, config };
}

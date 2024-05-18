import { ClassSerializerInterceptor, INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { useContainer } from "class-validator";
import { json, urlencoded } from "express";
import { AllConfigType } from "./config/config.type";
import { CustomExceptionFilter } from "./infrastructure/filters/custom-exception-filter";
import { AppModule } from "./modules/app/app.module";
import validationOptions from "./utils/validation-options";

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

  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));

  /**
   * use in case of implementing trace via aws xray
   */
  // app.use(AWSXray.express.openSegment(process.env.APP_NAME || 'calamidade-backend));

  const options = new DocumentBuilder().setTitle("API").setDescription("API docs").setVersion("1.0").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("docs", app, document);

  return { app, config };
}

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { bootstrap } from "./main";

void bootstrap().then(async ({ app, config }) => {
  const options = new DocumentBuilder().setTitle("API").setDescription("API docs").setVersion("1.0").addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup("docs", app, document);

  await app.listen(config.getOrThrow("app.port", { infer: true }));
});

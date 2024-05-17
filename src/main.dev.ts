import { bootstrap } from "./main";
import { urlencoded, json } from 'express';

void bootstrap().then(async ({ app, config }) => {
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(config.getOrThrow("app.port", { infer: true }));
});

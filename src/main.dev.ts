import { bootstrap } from "./main";

void bootstrap().then(async ({ app, config }) => {
  await app.listen(config.getOrThrow("app.port", { infer: true }));
});

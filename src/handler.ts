import serverlessExpress from "@codegenie/serverless-express";
import { Callback, Context, Handler } from "aws-lambda";
import { bootstrap } from "./main";

let server: Handler;

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  if (!server) {
    const { app } = await bootstrap();
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    server = serverlessExpress({ app: expressApp });
  }

  return server(event, context, callback);
};

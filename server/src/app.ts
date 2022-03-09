import Koa, { Context, Next } from "koa";
import json from "koa-json";
import koaBody from "koa-body";
import logger from "koa-logger";
import passport from "koa-passport";
import cors from "@koa/cors";
import { koaSwagger } from "koa2-swagger-ui";
import yamljs from "yamljs";
import path from "path";

import { apiRouter } from "./routes";
import bearerStrategy from "./middleware/strategy/bearerStrategy";

const app = new Koa();

const spec = yamljs.load(path.join(__dirname, "..", "openapi.yaml"));
app.use(cors());
app.use(async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = { status: "error", details: err.message };
    ctx.app.emit("error", err, ctx);
  }
});

app.use(logger());
app.use(koaBody());

app.use(passport.initialize());
app.use(passport.session());

bearerStrategy();

app.use(json());
apiRouter.get("/docs", koaSwagger({ swaggerOptions: { spec } }));

app.use(apiRouter.middleware());

app.on("error", (err, ctx: Context) => {
  ctx.assert(err, err.status, err.message);
});

export default app;

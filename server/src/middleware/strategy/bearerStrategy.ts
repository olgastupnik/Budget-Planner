import passport from "koa-passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";

import Config from "../../env";

export default function bearerStrategy(): void {
  try {
    passport.use(
      "bearerStrategy",
      new BearerStrategy(function async(token, done) {
        if (!token) {
          done(null, false);
        }
        try {
          const decoded = jwt.verify(token, Config.secretKey);
          done(null, decoded);
        } catch (err: any) {
          done(err, false);
        }
      })
    );
  } catch (err) {
    console.log(err);
  }
}

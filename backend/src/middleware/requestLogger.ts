import crypto from "crypto";
import morgan from "morgan";

morgan.token("id", (req: any) => req.id);

export const requestLogger = morgan(
  "[:id] :method :url :status :res[content-length] - :response-time ms",
  {
    skip: (req) => req.url === "/health",
  },
);

export const requestIdMiddleware = (req: any, res: any, next: any) => {
  req.id = crypto.randomUUID();
  next();
};

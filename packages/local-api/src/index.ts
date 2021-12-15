import express, { RequestHandler } from "express";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  const cellsRouter = createCellsRouter(filename, dir);

  app.use(cellsRouter);

  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: "http://localhost:3000",
        ws: true,
        logLevel: "silent",
      })
    );
  } else {

    const packageModulePath = (module: string) => {
      let _path = require.resolve(module)
      console.log(`${module} path: ${_path}`)
      return path.dirname(_path)
    }

    app.use(express.static(packageModulePath("@jscript-notebook/local-client/dist/index.html")));

    const local_pkg_path = packageModulePath('@jscript-notebook/local-pkg/README.md')

    // LOG STATIC REQUEST    
    const log:RequestHandler =  (req, res, next) => {
      const { url, path: routePath } = req;
      console.log(url, routePath);
      next();
    }
    app.use('/local', log, express.static(path.join(local_pkg_path, 'node_modules')))

  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};

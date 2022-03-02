import express, { RequestHandler } from "express";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells"


export const serve = (
  port:     number,
  filename: string,
  dir:      string,
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
    )
  } else {

    const packageModulePath = (module: string, join?: string) => {
      const _path = require.resolve(module)
      console.log(`${module} path: ${_path}`)
      const result = path.dirname(_path)
      return (join) ? path.join( result, join ) : result 
    }

    const local_client_page1_path = packageModulePath( path.join('@jscript-notebook', 'local-client-start', 'dist', 'index.html') )
    app.use( express.static( local_client_page1_path ) )

    const local_client_path = packageModulePath( path.join('@jscript-notebook', 'local-client', 'dist', 'index.html') )
    app.use( '/notebook', express.static( local_client_path ) )

    // LOG STATIC REQUEST    
    const log:RequestHandler =  (req, res, next) => {
      const { url, path: routePath } = req;
      console.log(url, routePath);
      next();
    }

    const local_pkg_path = packageModulePath( path.join('@jscript-notebook', 'local-pkg', 'README.md' ), 'node_modules')
    app.use('/local', log, express.static( local_pkg_path ))

  }

  return new Promise<void>((resolve, reject) => app.listen(port, resolve).on("error", reject) )
}

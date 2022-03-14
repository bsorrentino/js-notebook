import express, { RequestHandler } from "express";
import path from "path";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells"

export type Proxy = Options

export type StaticModule = {
  scope?:string 
  name:string
}

export type CellsRoute = {
  filename: string,
  dir: string
}

export interface Configuration {
  port: number
  proxy?: Options
  mainModule: StaticModule
  pkgModule?: StaticModule
  cellRoute?: CellsRoute
}

export const serve = async ( config:Configuration ) => {

  const { port, cellRoute, proxy, mainModule, pkgModule  } = config

  const app = express();

  if( cellRoute ) {
    const { filename, dir } = cellRoute

    const cellsRouter = createCellsRouter(filename, dir);

    app.use(cellsRouter);
  }


  if (proxy) {
    app.use( createProxyMiddleware(proxy) )
    // app.use(
    //   createProxyMiddleware({
    //     target: "http://localhost:3000",
    //     ws: true,
    //     logLevel: "silent",
    //   })
    // )
  } else {

    const packageModulePath = (module: string, join?: string) => {
      const _path = require.resolve(module)
      console.log(`${module} path: ${_path}`)
      const result = path.dirname(_path)
      return (join) ? path.join( result, join ) : result 
    }

    { // static route for main module
      const { scope = '', name } = mainModule
      const local_client_page1_path = packageModulePath( path.join( scope, name, 'dist', 'index.html') )
      app.use( express.static( local_client_page1_path ) )
    }

    {
      const scope = '@bsorrentino', name = 'jsnotebook-client'
      const local_client_path = packageModulePath( path.join( scope, name, 'dist', 'index.html') )
      app.use( '/notebook', express.static( local_client_path ) )  
    }


    if( pkgModule )
    { // static route for package module

      // LOG STATIC REQUEST    
      const log:RequestHandler =  (req, _, next) => {
        const { url, path: routePath } = req;
        console.log(url, routePath);
        next();
      }

      const { scope = '', name } = pkgModule
      const local_pkg_path = packageModulePath( path.join( scope, name, 'package.json' ), 'node_modules')
      app.use('/local', log, express.static( local_pkg_path ))
    }

  }

  return new Promise<void>((resolve, reject) => app.listen(port, resolve).on('error', reject) )
}

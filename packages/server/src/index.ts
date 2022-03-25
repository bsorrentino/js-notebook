import express, { RequestHandler } from "express";
import path from "path";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { createCellsRouter } from "./routes/cells"

export type Proxy = Options

export type StaticModulePath = string

export interface CustomStaticModulePath {
  route: string
  path: string
}

export type CellsRoute = {
  dir: string
}

export interface Configuration {
  port: number
  proxy?: Options
  mainModulePathName?: StaticModulePath
  pkgModulePath?: StaticModulePath
  extraModulePath?: CustomStaticModulePath
  cellRoute: CellsRoute
}

export const serve = async ( config:Configuration ) => {
  console.log( config )

  const { 
    port, 
    cellRoute, 
    proxy, 
    mainModulePathName = '/', 
    pkgModulePath, 
    extraModulePath, 
    cellRoute: { dir } 
  } = config

  const app = express();

  const cellsRouter = createCellsRouter(dir);

  app.use(cellsRouter);


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

    const modulePath = ( moduleName:string, join:string ) => 
        path.join( path.dirname(require.resolve( path.join('@bsorrentino', moduleName, 'package.json' ) )), join )

    // static route for main module      
    app.use( mainModulePathName, express.static( modulePath( 'jsnotebook-client-main', 'dist' ) ) )

    app.use( '/notebook', express.static( modulePath( 'jsnotebook-client', 'dist' ) ) )  

    if( extraModulePath ) { // static route for extra package module

      const { route, path } = extraModulePath
      app.use( route, express.static( path ))
      
    }

    if( pkgModulePath ) { // static route for package module

      // LOG STATIC REQUEST    
      const log:RequestHandler =  (req, _, next) => {
        const { url, path: routePath } = req;
        console.log(url, routePath);
        next();
      }

      app.use('/local', log, express.static( pkgModulePath ))
    }

  }

  return new Promise<void>((resolve, reject) => app.listen(port, resolve).on('error', reject) )
}

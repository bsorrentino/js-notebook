import express, { NextFunction } from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  type: "text" | "code";
  content: string;
}

type ExtraRequestArg = { fullPath:string, databaseName:string, notebookId:string }
/**
 * 
 * @param filename 
 * @param dir 
 * @returns 
 */
export const createCellsRouter = (dir: string) => {

  const getFullPath = ( req:express.Request, res:express.Response, next:NextFunction ) => {
      
      req.params.fullPath = path.join( dir, `${req.params.databaseName}_${req.params.notebookId}.json`)
      next()
  }

  return express.Router()
    .use(express.json())
    .get<ExtraRequestArg>('/cells/:databaseName/:notebookId', getFullPath, async (req, res) => {

      console.log("fetching cells ...");

      try {
        const result = await fs.readFile(req.params.fullPath, { encoding: "utf-8" });
        const payload = JSON.parse(result);
        res.send(payload);
      } catch (error:any) {
        if (error.code === "ENOENT") {
          await fs.writeFile(req.params.fullPath, "[]", "utf-8");
          res.send([]);
        } else {
          throw error;
        }
      }
    })
    .post<ExtraRequestArg>('/cells/:databaseName/:notebookId', getFullPath, async (req, res) => {
      console.log("saving notebook ...", req.body);

      const cells = req.body

      await fs.writeFile(req.params.fullPath, JSON.stringify(cells, undefined, 2), "utf-8");

      res.send({ status: "ok" });
    })
    .get<ExtraRequestArg>('/export/:databaseName/:notebookId', getFullPath, async (req, res) => {

      const options = {
        maxAge: 0,	// Sets the max-age property of the Cache-Control header in milliseconds or a string in ms format	
        lastModified: true,	// Sets the Last-Modified header to the last modified date of the file on the OS. Set false to disable it.
        headers: {}, //	Object containing HTTP headers to serve with the file. The header Content-Disposition will be overriden by the filename argument.
        dotfiles:'ignore',	// Option for serving dotfiles. Possible values are “allow”, “deny”, “ignore”.
        acceptRanges:true,	// Enable or disable accepting ranged requests.
        cacheControl:true,	// Enable or disable setting Cache-Control response header.
        immutable: false // Enable or disable the immutable directive in the Cache-Control response header. If enabled, the maxAge option should also be specified to enable caching. The immutable directive will prevent supported clients from making conditional requests during the life of the maxAge option to check if the file has changed.	
      }

      res.download( req.params.fullPath, path.basename(req.params.fullPath), options, (err) => {
        if( err ) {
          console.error( 'error downloading file', err )
          if( !res.headersSent ) res.status(500).send(err)  
        }
        else {
          console.log( 'downloaded file', req.params.fullPath)
        }
      })
    })

};

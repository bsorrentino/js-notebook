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
  const router = express.Router();

  router.use(express.json());

  router.get<ExtraRequestArg>('/cells/:databaseName/:notebookId', getFullPath, async (req, res) => {

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
  });

  router.post<ExtraRequestArg>('/cells/:databaseName/:notebookId', getFullPath, async (req, res) => {
    console.log("saving notebook ...", req.body);

    const cells = req.body

    await fs.writeFile(req.params.fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};

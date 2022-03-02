import {Cell} from './redux/cell'
import PouchDB from 'pouchdb'
import { initData } from './redux/initCellsData'

export interface NotebookDoc extends PouchDB.Core.IdMeta {
    cells: Array<Cell>
}

export type NotebookID = string

const db = new PouchDB<NotebookDoc>('jsnotebook')

// const DOCUMENT_ID = "notebook#2"

/**
 * 
 */
export async function info( ) {
    const info = await db.info()

    console.log( 'database info', info)
}

/**
 * 
 * @param id 
 * @param process 
 * @returns 
 */
export async function updateCellById( notebook:NotebookID, id:string, process:(cell:Cell) => void ) {

    const doc = await db.get( notebook )
    
    const cell = doc.cells.find( cell => cell.id === id )

    if( !cell ) throw `cell with id ${id} not found!`
      
    process( cell )

    return await db.put( doc )
}

/**
 * 
 * @param id 
 * @returns 
 */
export async function deleteCellById( notebook:NotebookID, id:string ) {

    const doc = await db.get( notebook )
    
    const new_cells = doc.cells.filter( cell => cell.id !== id )

    if( new_cells.length == doc.cells.length ) throw `cell with id ${id} not found!`

    doc.cells = new_cells
   
    return await db.put( doc )
}

/**
 * 
 * @param index 
 * @param cell 
 * @returns 
 */
export async function insertCellAtIndex( notebook:NotebookID, index:number, cell:Cell ) {

    const doc = await db.get( notebook )
      
    doc.cells.splice( index, 0, cell )
    
    return await db.put( doc )
}

/**
 * 
 * @returns 
 */
 export const saveCells = async ( notebook:NotebookID, cells: Array<Cell> ) => {
    const doc = await db.get( notebook )    
    doc.cells = cells   
    return await db.put( doc )
}

/**
 * 
 * @returns 
 */
export async function loadCells( notebook:NotebookID ) {

    try { 
        
        const doc = await db.get( notebook )

        return doc.cells
    }
    catch( err:any ) {
        console.warn( `doc '${notebook} not found!`, err )
        
        await db.put( { _id:notebook, cells:initData }, { force: true })

        return initData
    }
    
}

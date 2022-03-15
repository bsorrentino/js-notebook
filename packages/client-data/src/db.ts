import PouchDB from 'pouchdb'
import {Cell} from './cell'

export interface NotebookDoc extends PouchDB.Core.IdMeta {
    cells: Array<Cell>
}

const db = new PouchDB<NotebookDoc>('jsnotebook')

export type NotebookID = string

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
        
        const result:Cell[] = []

        await db.put( { _id:notebook, cells:result }, { force: true })

        return result
    }
    
}


/* 
* @returns 
*/
export const loadNotebooks = async ( include_docs = false ) => {
    const result = await db.allDocs( { include_docs: include_docs })
    console.log( 'all docs', result )
    return result
}

/* 
* @returns 
*/
export const addNotebook = async ( notebook:NotebookDoc ) =>
    await db.put( notebook )
    
/* 
* @returns 
*/
export const removeNotebookById = async ( id:string ) => {
    const doc = await db.get( id )

    return await db.remove( doc )
}
    
 
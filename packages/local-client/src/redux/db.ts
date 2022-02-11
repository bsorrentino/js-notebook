import {Cell} from './cell'
import PouchDB from 'pouchdb'
import { initData } from './initCellsData'

export interface DBDocument {
    _id: string
    cells: Array<Cell>
}

const db = new PouchDB<DBDocument>('jsnotebook')

const DOCUMENT_ID = "notebook#2"

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
export async function updateCellById( id:string, process:(cell:Cell) => void ) {

    const doc = await db.get( DOCUMENT_ID )
    
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
export async function deleteCellById( id:string ) {

    const doc = await db.get( DOCUMENT_ID )
    
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
export async function insertCellAtIndex( index:number, cell:Cell ) {

    const doc = await db.get( DOCUMENT_ID )
      
    doc.cells = doc.cells.splice( index, 0, cell )

    return await db.put( doc )
}

/**
 * 
 * @returns 
 */
 export async function saveCells( cells: Array<Cell> ) {
        return await db.put( {
             _id: DOCUMENT_ID,
             cells: cells
        })
}

/**
 * 
 * @returns 
 */
export async function loadCells( ) {

    try { 
        const doc = await db.get( DOCUMENT_ID )

        return doc.cells
    }
    catch( err:any ) {
        console.warn( `doc '${DOCUMENT_ID} not found!`, err )
        
        await db.put( { _id:DOCUMENT_ID, cells:initData }, { force: true })

        return initData
    }
    
}
    

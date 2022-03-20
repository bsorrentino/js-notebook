import PouchDB from 'pouchdb-browser'
import {Cell} from './cell'

export interface NotebookDoc extends PouchDB.Core.IdMeta {
    cells: Array<Cell>
}

declare var NOTEBOOK_DB:string|undefined

const processQueryString = ( qs:string ):Record<string,string> => {
    const initValue:Record<string,string> = {}

    if( qs===undefined || qs===null || qs.length===0 ) // GUARD
        return initValue

    return (qs[0]==='?' ? qs.substring(1) : qs)
                    .split('&')
                    .map(v => v.split('='))
                    .reduce( (prev,current) => {
                            const [name,value] = current
                            prev[decodeURIComponent(name)] = decodeURIComponent(value)
                            return prev
                    }, initValue )
}

console.log( window.location.search )

const { database, notebook } = processQueryString(window.location.search)

const notebookId = () => {

    if(  notebook!==undefined && notebook !== null && notebook.trim().length > 0 ) {
        return notebook
    }

    // console.warn( 'notebook id  is not specified in query parameter "?notebook=<id>"', 'default used')
    // return 'playground'

    // throw 'notebook id  is not specified in query parameter "?notebook=<id>"'

    return undefined
} 

const databaseName = () => {
    if(  database!==undefined && database !== null && database.trim().length > 0 ) {
        return database
    }

    if( NOTEBOOK_DB!==undefined && NOTEBOOK_DB!==null && NOTEBOOK_DB.trim().length > 0 ) {
        return NOTEBOOK_DB
    }

    // console.warn('database name is not specified neither in query parameter "?database=<dbname>" nor in global variable "NOTEBOOK_DB"! default is returned')
    // return 'jsnotebook'

    throw 'database name is not specified neither in query parameter "?database=<dbname>" nor in global variable "NOTEBOOK_DB"!'
}

export const context = {
    databaseName: databaseName(),
    notebookId: notebookId()
}

const db = new PouchDB<NotebookDoc>( context.databaseName )

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
export async function updateCellById(  id:string, process:(cell:Cell) => void ) {
    if( !context.notebookId ) throw 'notebook id has not been specified in query parameter "?notebook=<id>"'

    const doc = await db.get( context.notebookId )
    
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
    if( !context.notebookId ) throw 'notebook id has not been specified in query parameter "?notebook=<id>"'

    const doc = await db.get( context.notebookId )
    
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
    if( !context.notebookId ) throw 'notebook id has not been specified in query parameter "?notebook=<id>"'

    const doc = await db.get( context.notebookId )
      
    doc.cells.splice( index, 0, cell )
    
    return await db.put( doc )
}

/**
 * 
 * @returns 
 */
 export const saveCells = async ( cells: Array<Cell> ) => {
    if( !context.notebookId ) throw 'notebook id has not been specified in query parameter "?notebook=<id>"'

    const doc = await db.get( context.notebookId )    
    doc.cells = cells   
    return await db.put( doc )
}

/**
 * 
 * @returns 
 */
 export async function loadCells() {
    if( !context.notebookId ) throw 'notebook id has not been specified in query parameter "?notebook=<id>"'

    try { 
        
        const doc = await db.get( context.notebookId )

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
    
 
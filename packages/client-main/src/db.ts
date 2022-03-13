import {Cell} from './cell'
import PouchDB from 'pouchdb'

export interface NotebookDoc extends PouchDB.Core.IdMeta {
    cells: Array<Cell>
}

const db = new PouchDB<NotebookDoc>('jsnotebook')

/**
 * 
 */
export async function info( ) {
    const info = await db.info()

    console.log( 'database info', info)
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
    
 
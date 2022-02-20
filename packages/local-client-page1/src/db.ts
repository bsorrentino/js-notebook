import {Cell} from './redux/cell'
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
export const loadNotebooks = async() =>
    await db.allDocs()

/* 
* @returns 
*/
export const addNotebooks = async ( notebook:NotebookDoc ) =>
    await db.put( notebook )
    
/* 
* @returns 
*/
export const removeNotebooks = async ( notebookRef: PouchDB.Core.IdMeta & PouchDB.Core.RevisionIdMeta ) =>
    await db.remove( notebookRef )
 
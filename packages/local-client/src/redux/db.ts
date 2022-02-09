import {Cell} from './cell'
import PouchDB from 'pouchdb'

interface DBDocument {
    _id: string
    cells: Array<Cell>
}

type UpdateCellArg = { order:Array<string>,  data: Record<string,Cell> }

const db = new PouchDB<DBDocument>('jsnotebook')

const DOCUMENT_ID = "notebook#2"

export async function info( ) {
    const info = await db.info()

    console.log( 'database info', info)
}

export async function updateCells( state:UpdateCellArg ) {

    const doc = await db.get( DOCUMENT_ID )
    
    const { data, order } = state;
      
    doc.cells = order.map(id => data[id])

    return await db.put( doc )
}
    
export async function loadCells( ) {

    try { 
        const doc = await db.get( DOCUMENT_ID )

        return doc.cells
    }
    catch( err:any ) {
        console.warn( `doc '${DOCUMENT_ID} not found!`, err )
        
        await db.put( { _id:DOCUMENT_ID, cells:[] })
    }

    return []
    
}
    

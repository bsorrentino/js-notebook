import { FunctionComponent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import * as db from '@bsorrentino/jsnotebook-client-data'
import {DeletionNotebookPopup } from './DeletionNotebookPopup'
import {AddingNotebookPopup } from './AddingNotebookPopup'

type NotebookListProps = {}


const PanelTabs = () => (
    <p className="panel-tabs">
        <a className="is-active">All</a>
        <a>Public</a>
        <a>Private</a>
        <a>Sources</a>
        <a>Forks</a>
    </p>
)

const NotebookRow = ( params: {docId: string, onDelete:( id:string ) => void } ) => {

    const { docId: id }  = params

    return (
        <a className="columns is-vcentered panel-block" key={id} >
            <div className="column is-10">{ id }</div>
            <div className="column">
                <button className="button is-primary is-small is-rounded" style={{width: '100%'}} onClick={ () => window.location.href=`/notebook?database=${db.context.databaseName}&notebook=${id}` }>Edit</button>
            </div>
            <div className="column">
                <button className="button is-danger is-small is-rounded" style={{width: '100%'}} onClick={ () => params.onDelete(params.docId) }>Delete</button>
            </div>

        </a>
)}



const NotebookList: FunctionComponent<NotebookListProps> = () => {

    const [showAdding, setShowAdding] = useState<boolean>(false)
    const [itemForDeletion, setItemForDeletion] = useState<string|null>(null)
    const [notebooks, setNotebooks] = useState<Array<string>>([])
    useEffect(() => {

        db.loadNotebooks()
            .then(result => result.rows
                    .map(row => row.id))
            .then(setNotebooks)

    }, [])

    const deleteNotebook = useCallback( async ( id:string ) => {
        try {
            await db.removeNotebookById( id )
            
            const result = await db.loadNotebooks() 

            setNotebooks( result.rows.map( row => row.id ) )

            setItemForDeletion(null)
        }
        catch( err ) {
            console.error( `error deleting notebook ${id}`, err )
        }
    }, [ itemForDeletion!=null ] )

    const addNotebook = useCallback( async ( id:string ) => {
        try {
            await db.addNotebook( { _id: id, language: 'javascript', cells: [] } )
            
            const result = await db.loadNotebooks() 

            setNotebooks( result.rows.map( row => row.id ) )

            setShowAdding(false)
        }
        catch( err ) {
            console.error( `error adding notebook ${id}`, err )
        }
    }, [ itemForDeletion!=null ] )
    
    return (
        <>
            <AddingNotebookPopup active={showAdding} 
                onClose={ () => setShowAdding(false) } 
                onAdd={ id => addNotebook( id ) }/>
            <DeletionNotebookPopup docId={itemForDeletion} 
                             onClose={ () => setItemForDeletion(null) }  
                             onDelete={ id => deleteNotebook(id) } />
            <nav className="panel is-primary">
                <p className="panel-heading">
                    <div className="columns">
                    <div className="column is-11 is-size-3">Notebooks</div>
                    <div className="column">
                        <button className="button is-secondary is-rounded" onClick={ () => setShowAdding(true) }>Add</button>
                    </div>    
                    </div>
                </p>
                <div className="panel-block">
                    <p className="control has-icons-left">
                        <input className="input" type="text" placeholder="Search" />
                        <span className="icon is-left">
                            <i className="fas fa-search" aria-hidden="true"></i>
                        </span>
                    </p>
                </div>
                { /* <PanelTabs/> */}
                { notebooks.map( id => NotebookRow( { docId:id, onDelete:( id ) => setItemForDeletion(id) } ) ) }
                <div className="panel-block">
                    <button className="button is-link is-outlined is-fullwidth">
                        Reset all filters
                    </button>
                </div>
            </nav>
        </>
    )
}

export default NotebookList
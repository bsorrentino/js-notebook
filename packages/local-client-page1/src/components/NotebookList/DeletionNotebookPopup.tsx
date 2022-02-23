import { FunctionComponent } from "react"

export type DeletionNotebookPopupProps = { 
    docId:string|null,
    onClose: () => void
    onDelete: ( id:string ) => void 
}

export const DeletionNotebookPopup: FunctionComponent<DeletionNotebookPopupProps> = ( params:DeletionNotebookPopupProps ) => {

    const { docId, onClose, onDelete } = params
    const message = `Confirm deletion of notebook '${params.docId}' ?`
    
    const className = `modal ${ docId!==null ? 'is-active' : ''}`  
    return (
        <div className={className}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Delete Notebook</p>
                    <button className="delete" aria-label="close" onClick={ () => onClose() }></button>
                </header>
                <section className="modal-card-body">
                        <span className="is-size-3">{message}</span>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-danger" onClick={ () => onDelete( docId!) }>Delete</button>
                    <button className="button" onClick={ () => onClose() }>Cancel</button>
                </footer>
            </div>
        </div>
    )
}
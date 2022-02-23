import { FunctionComponent, useEffect, useRef, useState } from "react"
import { makeDebounce } from "../../debounce"

const inputDebounce = makeDebounce( 800 )

export type AddingNotebookPopupProps = { 
    active?:boolean,
    onClose: () => void
    onAdd: ( id:string ) => void 
}

export const AddingNotebookPopup: FunctionComponent<AddingNotebookPopupProps> = ( params:AddingNotebookPopupProps ) => {
    const { active = false, onClose, onAdd } = params
    const className = `modal ${ active ? 'is-active' : ''}`  

    const inputRef = useRef<HTMLInputElement>(null)
    const [docId, setDocId] = useState<string>('')

    useEffect( () => {
        console.log( 'setDocId( null )')
        setDocId( '' )
        if( inputRef.current ) 
            inputRef.current.value = ''

    }, [!active] )


    return (
        <div className={className}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Add Notebook</p>
                    <button className="delete" aria-label="close" onClick={ () => onClose() }></button>
                </header>
                <section className="modal-card-body">
                        <input className="input is-primary" type="text" placeholder="type notebook name" 
                                ref={inputRef}
                                onChange={ (e) => inputDebounce( () => setDocId(e.target.value) )}></input>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-primary" disabled={docId.length===0} onClick={ () => onAdd( docId!) }>Add</button>
                    <button className="button" onClick={ () => onClose() }>Cancel</button>
                </footer>
            </div>
        </div>
    )
}
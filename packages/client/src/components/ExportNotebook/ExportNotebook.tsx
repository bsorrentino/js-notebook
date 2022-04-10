import { useEffect, useRef } from "react"
import { useDispatch } from "../../hooks"
import { exportNotebook } from "../../redux"
import * as db from '@bsorrentino/jsnotebook-client-data'
import { getLogger } from "@bsorrentino/jsnotebook-logger";

const logger = getLogger( 'ExportNotebook' )

interface ExportNotebookProps {
    saveStatus: string|null
} 

export  const ExportNotebook: React.FC<ExportNotebookProps> = ( { saveStatus }) => {

    const link = useRef<HTMLAnchorElement>(null)

    const dispatch = useDispatch()

    useEffect( () => {
        // download event
        logger.trace( 'ExportNotebook.saveStatus',saveStatus )
        if( saveStatus === 'exportNotebook.success' ) 
            link.current?.click()
    })

    const { databaseName, notebookId:notebook,   } = db.context

    return (
        <div className="is-flex" >
            <button className="button is-outlined" onClick={ () => dispatch(exportNotebook())}>Export</button>
            <a ref={link} style={{visibility: 'hidden'}} href={`/export/${databaseName}/${notebook}`} download>link</a>
        </div>
    )
}
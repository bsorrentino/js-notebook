import { useDispatch } from "react-redux"
import { importNotebook } from "../../redux"
import { getLogger } from "@bsorrentino/jsnotebook-logger";

const logger = getLogger( 'ImportNotebook' )

interface ImportNotebookProps {}

export  const ImportNotebook: React.FC<ImportNotebookProps> = () => {

    const dispatch = useDispatch()

    const setFile = ( file:File ) => { 
       
        logger.trace( 'setFile', file )

        file.text()
            .then( contents => {
                logger.trace( contents )
                dispatch( importNotebook( JSON.parse( contents ) ))
            })
            .catch( err => {
                logger.error( err )
            })
    }
       
    return (
        <div className="file is-link">
        <label className="file-label">
            <input className="file-input" type="file" name="resume" onChange={ (e:any) => setFile( e.target.files[0] )}/>
            <span className="file-cta">
            {/*
            <span className="file-icon">
                <i className="fas fa-upload"></i>
            </span>      
            */}    
            <span className="file-label">
                Import ...
            </span>
            </span>
        </label>
        </div>    
    )
}
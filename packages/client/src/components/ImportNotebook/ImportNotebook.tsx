import { useMemo, useState } from "react"



export  const ImportNotebook: React.FC = () => {

    const [file, _setFile] = useState<File>()

    const setFile = ( file:File ) => { 

        _setFile( file )

        // Create an object of formData 
        const formData = new FormData(); 
       
        // Update the formData object 
        formData.append( 
          "importFile", 
          file, 
          file.name 
        ); 
       
        // Details of the uploaded file 
        console.log(file); 
       
        // Request made to the backend api 
        // Send formData object 
        //axios.post("api/uploadfile", formData); 
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
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateNotebookLanguage } from "../../redux";
import {  NotebookLanguage } from "@bsorrentino/jsnotebook-client-data";
import { getLogger } from "@bsorrentino/jsnotebook-logger";

const logger = getLogger( 'LanguageDropdown' )


interface LanguageDropdownProps {
  id: string;
  initialLanguage: NotebookLanguage;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  id,
  initialLanguage,
}) => {
  const selectEl = useRef<HTMLSelectElement>(null)
  const dispatch = useDispatch()
  const [language, _setLanguage] = useState<NotebookLanguage>(initialLanguage);

  const setLanguage = ( language:NotebookLanguage ) => {
    _setLanguage( language )
    document.dispatchEvent( new CustomEvent('notebook.updateLanguage', { detail: language }) ) 
  }

  useEffect( () => {
    const handler = ( e:any ) => {
      if( !selectEl.current ) return // GUARD
      if( selectEl.current.value != e.detail  ) {
        logger.trace( 'notebook.updateLanguage set', selectEl.current.value, e.detail )
        _setLanguage(  e.detail )
      }
    }
    document.addEventListener( 'notebook.updateLanguage', handler, false)

    return () => document.removeEventListener( 'notebook.updateLanguage', handler)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as NotebookLanguage
    setLanguage(lang);
    dispatch( updateNotebookLanguage({ language: lang }) )
  };

  return (
    <div className="select is-primary">
      <select ref={selectEl} value={language} onChange={handleChange}>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;

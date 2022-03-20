import { CellLanguages } from "@bsorrentino/jsnotebook-client-data";
import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCellLanguage } from "../../redux"

interface LanguageDropdownProps {
  id: string;
  initialLanguage: CellLanguages;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  id,
  initialLanguage,
}) => {
  const dispatch = useDispatch()
  const [language, setLanguage] = useState<CellLanguages>(initialLanguage);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as CellLanguages
    setLanguage(lang);
    dispatch( updateCellLanguage({ id, language: lang }) )
  };

  return (
    <div className="select is-primary">
      <select value={language} onChange={handleChange}>
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;

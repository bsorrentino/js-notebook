import React from "react";
import CellsList from "./components/CellsList/CellsList";
import {  useRenderAfterLogin } from '@bsorrentino/xrmtoolboxweb-core'

const App: React.FC = () => {

  const { instance, account, scopes, renderAfterLogin } = useRenderAfterLogin()

  return renderAfterLogin( () => (
    <div className="App">
      <CellsList />
    </div>
  ));
};

export default App;

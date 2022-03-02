import {FunctionComponent} from "react"
import NotebookList from './components/NotebookList/NotebookList'
import {  useRenderAfterLogin } from '@bsorrentino/xrmtoolboxweb-core'

const App: FunctionComponent = () => {

  const { instance, account, scopes, renderAfterLogin } = useRenderAfterLogin()

  return renderAfterLogin( () => (
    <div className="App">
      <NotebookList />
    </div>
  ));
};

export default App;

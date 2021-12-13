import ReactDOM from "react-dom";
import App from "./App";
import Layout from "./components/Layout/Layout";
import { Provider } from "react-redux";
import store from "./redux";
import "./global.scss";

import { MsalProvider } from "@azure/msal-react";
import { PCA } from '@bsorrentino/xrmtoolboxweb-core'

ReactDOM.render(
  <MsalProvider instance={PCA}>
    <Provider store={store}>
      <Layout>
        <App />
      </Layout>
    </Provider>
  </MsalProvider>,
  document.getElementById("root")
);

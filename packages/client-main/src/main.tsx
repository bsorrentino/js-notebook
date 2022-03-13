import { render } from "react-dom";
import App from "./App";
import Layout from "./components/Layout/Layout";
import "./global.scss";
// import dynamicImportPolyfill from 'dynamic-import-polyfill'
// dynamicImportPolyfill.initialize()

render(
    <Layout>
      <App />
    </Layout>,
  document.getElementById("root")
);

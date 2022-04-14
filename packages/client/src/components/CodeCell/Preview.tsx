import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "../../hooks";
import "./Preview.scss";

const html = `
<html>
  <head>
    <body>
      <div id = "root"></div>
      <script>
        const process = {env: {NODE_ENV: "production"}}
      </script>
      <script>
        const handleError = (error) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
          // console.error(error);
        }

        window.addEventListener('error', (event) => {
          // handle asynchronous run-time error
          handleError(event.error)
        })

        window.addEventListener("message", (event) => {
            const {code, error} = event.data
            if( error ) {
              // bundle-time error
              handleError(error)
              return
            }
            if( code ) {
              try {
                eval(code)
              } catch(error) {
                // handle run-time aerror
                handleError(error)
              }
            }
          }, false)
      </script>
    </body>
  </head>
</html>
`;

interface PreviewProps {
  id: string
}

const Preview: React.FC<PreviewProps> = ({ id }) => {

  const iframe = useRef<HTMLIFrameElement>(null);

  const { code, error, loading } = useSelector(
    (state) => state.bundler[id] ?? {
      code: '',
      error: '',
      loading: false,
    }
  )

  useEffect(() => {
    iframe.current?.contentWindow?.postMessage({ code, error }, "*");
  }, [code, error]);

  const [cardCollapsed, setCardCollapsed] = useState(true);

  useEffect(() => {
    if( loading && cardCollapsed ) {
      setCardCollapsed(false)
    }
  }, [loading] );

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">Result</p>
        <button
          onClick={() => setCardCollapsed(!cardCollapsed)}
          className="card-header-icon"
          aria-label="more options"
        >
          <span className="icon">
            <i className="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </header>
      <div className={'preview-wrapper' + (cardCollapsed  ? ' is-hidden' : '')}>
        {loading && (
          <div className="progress-wrapper">
            <progress className="progress is-small is-primary" max="">
              Loading
            </progress>
          </div>
        )}
        <iframe
          title="preview"
          ref={iframe}
          sandbox="allow-scripts allow-same-origin allow-modals"
          srcDoc={html}
        />
      </div>
    </div>
  );
};

export default React.memo(Preview);

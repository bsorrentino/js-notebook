

export const SHOW = {
    implementation: `
        show = (value, concat = false) => {
            const root = document.querySelector('#root')
            if (typeof value === 'object') {
                if (value.$$typeof && value.props) {
                    if(!concat) 
                        ReactDOM.render(value, root)
                } else {
                    root.innerHTML = !concat ? JSON.stringify(value) : root.innerHTML + '<br/>' + JSON.stringify(value)
                }
            } else {
                root.innerHTML = !concat ? value : root.innerHTML + '<br/>' + value
            }
        }
        `,
    declaration: `
        declare let show: ( value: JSX.Element|object|string, concat?:boolean ) => void;
        `
}   
import { FunctionComponent, useEffect, useLayoutEffect, useState } from 'react'
import * as db from '../../db'

type NotebookListProps = {}


const PanelTabs = () => (
    <p className="panel-tabs">
        <a className="is-active">All</a>
        <a>Public</a>
        <a>Private</a>
        <a>Sources</a>
        <a>Forks</a>
    </p>
)

const NotebookRow = ( docId: string ) => (
    <a className="panel-block">
    {/*
        <span className="panel-icon">
            <i className="fas fa-book" aria-hidden="true"></i>
        </span>
    */}
        <button className="button is-link" >{ docId.toUpperCase() }</button>    
    </a>
)

const NotebookList: FunctionComponent<NotebookListProps> = () => {
    const [notebooks, setNotebooks] = useState<Array<string>>([])
    useEffect(() => {

        db.loadNotebooks()
            .then(result => result.rows
                    .map(row => row.id))
            .then(setNotebooks)

    }, [])

    return (
        <>
            <nav className="panel is-primary">
                <p className="panel-heading">
                    Notebooks
                </p>
                <div className="panel-block">
                    <p className="control has-icons-left">
                        <input className="input" type="text" placeholder="Search" />
                        <span className="icon is-left">
                            <i className="fas fa-search" aria-hidden="true"></i>
                        </span>
                    </p>
                </div>
                { /* <PanelTabs/> */}
                { notebooks.map( id => NotebookRow( id ) ) }
                <div className="panel-block">
                    <button className="button is-link is-outlined is-fullwidth">
                        Reset all filters
                    </button>
                </div>
            </nav>
        </>
    )
}

export default NotebookList
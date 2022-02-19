import React from "react";

type NotebookListProps = void

const NotebookList: React.FC<NotebookListProps> = () => {
    return (
        <nav className="panel">
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
            <p className="panel-tabs">
                <a className="is-active">All</a>
                <a>Public</a>
                <a>Private</a>
                <a>Sources</a>
                <a>Forks</a>
            </p>
            <a className="panel-block is-active">
                <span className="panel-icon">
                    <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                bulma
            </a>
            <a className="panel-block">
                <span className="panel-icon">
                    <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                marksheet
            </a>
            <a className="panel-block">
                <span className="panel-icon">
                    <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                minireset.css
            </a>
            <a className="panel-block">
                <span className="panel-icon">
                    <i className="fas fa-book" aria-hidden="true"></i>
                </span>
                jgthms.github.io
            </a>
            <a className="panel-block">
                <span className="panel-icon">
                    <i className="fas fa-code-branch" aria-hidden="true"></i>
                </span>
                daniellowtw/infboard
            </a>
            <a className="panel-block">
                <span className="panel-icon">
                    <i className="fas fa-code-branch" aria-hidden="true"></i>
                </span>
                mojs
            </a>
            <label className="panel-block">
                <input type="checkbox" />
                remember me
            </label>
            <div className="panel-block">
                <button className="button is-link is-outlined is-fullwidth">
                    Reset all filters
                </button>
            </div>
        </nav>)
}
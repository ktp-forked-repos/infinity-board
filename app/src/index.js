import ReactDOM from 'react-dom';
import DraggableBox from './board';
import React from 'react';
import './App.css';
import BoardList from "./board-list";

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            mode: 'list',
            boards: {},
            currentBoardId: null,
        }
    }

    setBoardList = (boards) => {
        this.setState({boards});
    };

    setCurrentBoardId = (id) => {
        this.setState({
            currentBoardId: id,
            mode: id ? 'board' : 'list',
        });
    };

    render() {
        // Figure out what should be shown
        let content = this.state.mode === 'list'
            ? <BoardList/>
            : <DraggableBox/>;

        // Now show it
        return (
            <div className="app">
                {content}
            </div>
        )
    }

}


ReactDOM.render(<App />, document.getElementById('root'));

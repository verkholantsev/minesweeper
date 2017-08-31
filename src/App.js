import React, {Component} from 'react';
import './App.css';
import GameField from './GameField/GameField';

function generateField(width, height, minesCount) {
    let field = [];

    for (let x = 0; x < width; x++) {
        field.push([]);

        for (let y = 0; y < height; y++) {
            field[x].push({hasMine: 0, isOpened: 0, isVisitedTag: null});
        }
    }

    for (let i = 0; i < minesCount; i++) {
        const {x, y} = generateMineCoords(field, width, height);
        field[x][y].hasMine = 1;
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            field[x][y].nearestMinesCount = getNearestMineCount(field, x, y);
        }
    }

    return field;
}

function traverseNearestSquares(field, x, y, fn) {
    const squaresToTraverse = [
        {x: x - 1, y       }, // N
        {x: x - 1, y: y + 1}, // NE
        {x,        y: y + 1}, // E
        {x: x + 1, y: y + 1}, // SE
        {x: x + 1, y       }, // S
        {x: x + 1, y: y - 1}, // SW
        {x,        y: y - 1}, // W
        {x: x - 1, y: y - 1}, // NW
    ];

    squaresToTraverse.forEach(({x, y}) => {
        const row = field[x];
        if (!row) {
            return;
        }
        const square = row[y];
        if (!square) {
            return;
        }
        fn(square, x, y);
    });
}

function getNearestMineCount(field, x, y) {
    let count = 0;
    traverseNearestSquares(field, x, y, field => {
        if (field.hasMine) {
            count++;
        }
    });

    return count;
}

function generateMineCoords(field, width, height) {
    const x = Math.round(Math.random() * (width - 1));
    const y = Math.round(Math.random() * (height - 1));

    if (field[x][y].hasMine === 1) {
        return generateMineCoords(field, width, height);
    }

    return {x, y};
}

function handleSquareClick(field, x, y, isVisitedTag = new Date().valueOf()) {
    const square = field[x][y];
    square.isOpened = 1;
    square.isVisitedTag = isVisitedTag;

    if (square.nearestMinesCount === 0 && !square.hasMine) {
        traverseNearestSquares(field, x, y, (square, newX, newY) => {
            if (square.isVisitedTag !== isVisitedTag) {
                handleSquareClick(field, newX, newY, isVisitedTag);
            }
        });
    }

    return field;
}

class App extends Component {
    constructor() {
        super();

        this.state = {
            field: generateField(10, 10, 10),
        };
    }

    render() {
        return (
            <div className='App'>
                <GameField
                    field={this.state.field}
                    onSquareClick={data => this._onSquareClick(data)}/>
            </div>
        );
    }

    _onSquareClick({x, y}) {
        const field = handleSquareClick(this.state.field, x, y);
        this.setState({field});
    }
}

export default App;

import React, {Component} from 'react';
import './App.css';
import GameField from '../GameField/GameField';

function generateField(width, height, minesCount) {
    let field = [];

    for (let x = 0; x < width; x++) {
        field.push([]);

        for (let y = 0; y < height; y++) {
            field[x].push({
                hasMine: 0,
                isOpened: 0,
                isVisitedTag: null,
                x,
                y,
            });
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

function getNearestSquaresCoords(field, x, y) {
    const nearestSquaresCoords = [
        {x: x - 1, y       }, // N
        {x: x - 1, y: y + 1}, // NE
        {x,        y: y + 1}, // E
        {x: x + 1, y: y + 1}, // SE
        {x: x + 1, y       }, // S
        {x: x + 1, y: y - 1}, // SW
        {x,        y: y - 1}, // W
        {x: x - 1, y: y - 1}, // NW
    ];

    return nearestSquaresCoords.filter(({x, y}) => {
        const row = field[x];
        if (!row) {
            return false;
        }
        const square = row[y];
        if (!square) {
            return false;
        }
        return true;
    });
}

function traverseNearestSquares(field, x, y, fn) {
    const squaresToTraverse = getNearestSquaresCoords(field, x, y);

    squaresToTraverse.forEach(({x, y}) => {
        const square = field[x][y];
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

function handleSquareClick(field, x, y) {
    const queue = [field[x][y]];
    const isVisitedTag = new Date().valueOf();

    while (queue.length > 0) {
        const square = queue.shift();
        square.isOpened = 1;

        if (square.nearestMinesCount === 0 && !square.hasMine) {
            const nearestSquaresCoords = getNearestSquaresCoords(field, square.x, square.y);
            const squaresToAddToQueue = nearestSquaresCoords
                .map(({x, y}) => field[x][y])
                .filter(square => square.isVisitedTag !== isVisitedTag);

            squaresToAddToQueue.forEach(square => {
                square.isVisitedTag = isVisitedTag;
            });

            queue.push(...squaresToAddToQueue);
        }
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

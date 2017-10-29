import 'babel-polyfill';

import React, {Component} from 'react';
import GameField from '../GameField/GameField';
import MinesLeftCount from '../MinesLeftCount/MinesLeftCount';

import './App.css';

const GameState = {
    IN_PROGRESS: 'IN_PROGRESS',
    WIN: 'WIN',
    LOSE: 'LOSE',
};

function generateField(width, height, minesCount) {
    let field = [];

    for (let x = 0; x < width; x++) {
        field.push([]);

        for (let y = 0; y < height; y++) {
            field[x].push({
                hasFlag: 0,
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
    if (field[x][y].hasFlag) {
        return field;
    }

    const queue = [field[x][y]];
    const isVisitedTag = new Date().valueOf();

    while (queue.length > 0) {
        const square = queue.shift();
        if (square.hasFlag) {
            continue;
        }

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

function handleSquareRightClick(field, x, y) {
    const {hasFlag} = field[x][y];
    field[x][y] = {...field[x][y], hasFlag: hasFlag === 0 ? 1 : 0};
    return field;
}

function openField(field) {
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field[x].length; y++) {
            field[x][y] = {...field[x][y], isOpened: 1};
        }
    }

    return field;
}

class App extends Component {
    constructor() {
        super();

        const minesCount = 10;

        this.state = {
            field: generateField(10, 10, minesCount),
            gameState: GameState.IN_PROGRESS,
            minesLeftCount: minesCount,
        };
    }

    render() {
        return (
            <div className='App'>
                {this._renderGameState()}
                <div className='App__gameFieldWrapper'>
                    <GameField
                        field={this.state.field}
                        onSquareClick={data => this._onSquareClick(data)}
                        onSquareRightClick={data => this._onSquareRightClick(data)}/>
                </div>
            </div>
        );
    }

    _renderGameState() {
        const {gameState, minesLeftCount} = this.state;

        switch (gameState) {
        case GameState.IN_PROGRESS:
            return <MinesLeftCount className='App__mineLeftCount' count={minesLeftCount}/>;
        case GameState.WIN:
            return <div className='App__mineLeftCount'>😎</div>;
        case GameState.LOSE:
            return <div className='App__mineLeftCount'>😫</div>;
        default:
            throw new Error(`Unexpected game state: ${gameState}`);
        }
    }

    _onSquareClick({x, y}) {
        const {hasMine} = this.state.field[x][y];
        if (hasMine) {
            this.setState({
                field: openField(this.state.field),
                gameState: GameState.LOSE,
            });
            return;
        }

        const field = handleSquareClick(this.state.field, x, y);
        this.setState({field});
    }

    _onSquareRightClick({x, y}) {
        const {isOpened, hasFlag} = this.state.field[x][y];
        const {minesLeftCount} = this.state;
        if (isOpened || (minesLeftCount === 0 && !hasFlag)) {
            return;
        }

        const field = handleSquareRightClick(this.state.field, x, y);

        this.setState({
            field,
            minesLeftCount: hasFlag ? minesLeftCount + 1 : minesLeftCount - 1,
        });
    }
}

export default App;

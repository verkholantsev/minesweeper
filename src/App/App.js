import 'babel-polyfill';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
                hasFlag: false,
                hasMine: false,
                isOpened: false,
                isVisitedTag: null,
                x,
                y,
            });
        }
    }

    for (let i = 0; i < minesCount; i++) {
        const {x, y} = generateMineCoords(field, width, height);
        field[x][y].hasMine = true;
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

function handleSquareClick(state, x, y, minesCount) {
    const {field} = state;
    const {hasFlag, hasMine} = field[x][y];

    if (hasFlag) {
        return state;
    } else if (hasMine) {
        return {
            ...state,
            field: openField(field),
            gameState: GameState.LOSE,
        };
    }

    const queue = [field[x][y]];
    const isVisitedTag = new Date().valueOf();

    while (queue.length > 0) {
        const square = queue.shift();
        if (square.hasFlag) {
            continue;
        }

        square.isOpened = true;

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

    if (getClosedSquaresCount(field) === minesCount) {
        return {
            ...state,
            field: openField(field),
            gameState: GameState.WIN,
        };
    }

    return {
        ...state,
        field,
    };
}

function handleSquareRightClick(state, x, y) {
    const {field, minesLeftCount} = state;
    const {hasFlag, isOpened} = field[x][y];

    if (isOpened || (minesLeftCount === 0 && !hasFlag)) {
        return state;
    }

    field[x][y] = {...field[x][y], hasFlag: !hasFlag};

    return {
        ...state,
        field,
        minesLeftCount: hasFlag ? minesLeftCount + 1 : minesLeftCount - 1,
    };
}

function openField(field) {
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field[x].length; y++) {
            field[x][y] = {...field[x][y], isOpened: true};
        }
    }

    return field;
}

function getClosedSquaresCount(field) {
    let closedCount = 0;
    for (let row of field) {
        for (let col of row) {
            if (!col.isOpened) {
                closedCount++;
            }
        }
    }
    return closedCount;
}

class App extends Component {
    constructor(props) {
        super(props);

        const {
            minesCount,
            width,
            height,
        } = props;

        this.state = {
            closedSquaresCount: width * height,
            field: generateField(width, height, minesCount),
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
        const state = handleSquareClick(this.state, x, y, this.props.minesCount);
        this.setState(() => state);
    }

    _onSquareRightClick({x, y}) {
        const {isOpened, hasFlag} = this.state.field[x][y];
        const {minesLeftCount} = this.state;
        if (isOpened || (minesLeftCount === 0 && !hasFlag)) {
            return;
        }

        const state = handleSquareRightClick(this.state, x, y);
        this.setState(() => state);
    }
}

App.defaultProps = {
    height: 10,
    minesCount: 10,
    width: 10,
};

App.propTypes = {
    height: PropTypes.number,
    minesCount: PropTypes.number,
    width: PropTypes.number,
};

export default App;

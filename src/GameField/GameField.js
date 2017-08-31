import React from 'react';
import Square from '../Square/Square';
import './GameField.css';

function GameField(props) {
    const {field, onSquareClick} = props;

    const fieldContent = field.map((row, x) => {
        const rowContent = row.map((square, y) => {
            return <Square {...square} onClick={() => onSquareClick({x, y})}/>;
        });

        return <div className='GameField__row'>{rowContent}</div>;
    });

    return (
        <div className='GameField'>
            {fieldContent}
        </div>
    );
}

export default GameField;

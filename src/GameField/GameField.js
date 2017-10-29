import React from 'react';
import PropTypes from 'prop-types';
import Square from '../Square/Square';
import './GameField.css';

function GameField(props) {
    const {field, onSquareClick, onSquareRightClick} = props;

    const fieldContent = field.map((row, x) => {
        const rowContent = row.map((square, y) => {
            const key = `${x}-${y}`;
            return (
                <Square
                    {...square}
                    key={key}
                    onClick={() => onSquareClick({x, y})}
                    onContextMenu={event => {
                        event.preventDefault();
                        onSquareRightClick({x, y});
                    }}/>
            );
        });

        return <div className='GameField__row' key={x}>{rowContent}</div>;
    });

    return (
        <div className='GameField'>
            {fieldContent}
        </div>
    );
}

GameField.propTypes = {
    field: PropTypes.array,
    onSquareClick: PropTypes.func,
    onSquareRightClick: PropTypes.func,
};

export default GameField;

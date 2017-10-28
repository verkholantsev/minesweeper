import React from 'react';
import PropTypes from 'prop-types';
import './Square.css';

function Square(props) {
    const {hasMine, isOpened, nearestMinesCount, onClick} = props;

    let className = 'Square';
    if (isOpened) {
        className = `${className} Square__opened Square__content_${nearestMinesCount}`;
    }

    let content = null;
    if (!isOpened) {
        content = '';
    } else if (hasMine) {
        content = '💣';
    } else if (nearestMinesCount > 0) {
        content = nearestMinesCount;
    }

    return (
        <div className={className} onClick={onClick}>{content}</div>
    );
}

Square.propTypes = {
    hasMine: PropTypes.number,
    isOpened: PropTypes.number,
    nearestMinesCount: PropTypes.number,
    onClick: PropTypes.func,
};

export default Square;

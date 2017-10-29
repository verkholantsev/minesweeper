import React from 'react';
import PropTypes from 'prop-types';
import './Square.css';

function Square(props) {
    const {
        hasFlag,
        hasMine,
        isOpened,
        nearestMinesCount,
        onClick,
        onContextMenu,
    } = props;

    let className = 'Square';
    if (isOpened) {
        className = `${className} Square__opened Square__content_${nearestMinesCount}`;
    }

    let content = null;
    if (!isOpened) {
        content = hasFlag ? 'F' : '';
    } else if (hasMine) {
        content = '💣';
    } else if (nearestMinesCount > 0) {
        content = nearestMinesCount;
    }

    return (
        <div
            className={className}
            onClick={onClick}
            onContextMenu={onContextMenu}>
            {content}
        </div>
    );
}

Square.propTypes = {
    hasFlag: PropTypes.bool,
    hasMine: PropTypes.bool,
    isOpened: PropTypes.bool,
    nearestMinesCount: PropTypes.number,
    onClick: PropTypes.func,
    onContextMenu: PropTypes.func,
};

export default Square;

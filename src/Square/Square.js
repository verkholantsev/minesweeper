import * as React from 'react';
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

export default Square;

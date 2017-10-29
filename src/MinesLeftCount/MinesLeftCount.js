import React from 'react';
import PropTypes from 'prop-types';
import './MinesLeftCount.css';

export default function MinesLeftCount(props) {
    const {count, className} = props;
    const label = count === 1 ? 'mine left' : 'mines left';

    return (
        <div className={`MinesLeftCount ${className}`}>
            {count} {label}
        </div>
    );
}

MinesLeftCount.propTypes = {
    className: PropTypes.string,
    count: PropTypes.number,
};

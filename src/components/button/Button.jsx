import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './Button.module.css'

class Button extends Component {
    render() {
        const { loadMore } = this.props;

        return (
            <button className={styles.Button} onClick={loadMore}>
                Load More
            </button>
        );
    }
}

Button.propTypes = {
    loadMore: PropTypes.func.isRequired
}

export default Button;
import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './Modal.module.css'

class Modal extends Component {
    render() {
        const { imageUrl, altText, handleCloseModal } = this.props;

        return (
            <div onClick={handleCloseModal} className={styles.Overlay} >
                <div className={styles.Modal}>
                    <img src={imageUrl} alt={altText} />
                </div>
            </div>
        );
    }
}

Modal.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    handleCloseModal: PropTypes.func.isRequired
};

export default Modal;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';
import { useEffect } from 'react';

const Modal = ({ imageUrl, altText, handleCloseModal }) => {



    useEffect(() => {

        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                handleCloseModal();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        }
    }, [handleCloseModal])


    return (
        <div onClick={handleCloseModal} className={styles.Overlay}>
            <div className={styles.Modal}>
                <img src={imageUrl} alt={altText} />
            </div>
        </div>
    );
};

Modal.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
};

export default Modal;

import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './ImageGalleryItem.module.css'

class ImageGalleryItem extends Component {
    render() {
        const { image, index, callback } = this.props;

        return (
            <li onClick={callback} className={styles.ImageGalleryItem} key={index}>
                <img className={styles.ImageGalleryItemImage} src={image.webformatURL} alt={image.tags} />
            </li>
        );
    }
}

ImageGalleryItem.propTypes = {
    image: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    callback: PropTypes.func.isRequired,
}

export default ImageGalleryItem;

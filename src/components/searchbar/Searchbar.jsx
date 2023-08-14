import React, { useState } from "react";
import PropTypes from 'prop-types';
import styles from './Searchbar.module.css'

const Searchbar = ({ onSearchSubmit }) => {
    const [searchBar, setSearchBar] = useState("");

    const handleInputChange = (e) => {
        setSearchBar(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSearchSubmit(searchBar);
    };

    return (
        <div className={styles.Searchbar}>
            <form onSubmit={handleFormSubmit} className={styles.SearchForm}>
                <button type="submit" className={styles.SearchFormButton}>Search</button>
                <input
                    className={styles.SearchFormInput}
                    type="text"
                    value={searchBar}
                    onChange={handleInputChange}
                />
            </form>
        </div>
    );
}

Searchbar.propTypes = {
    onSearchSubmit: PropTypes.func.isRequired
}

export default Searchbar;

import React, { Component } from "react";
import PropTypes from 'prop-types';
import styles from './Searchbar.module.css'

class Searchbar extends Component {
    state = {
        searchBar: "",
    };

    handleInputChange = (e) => {
        this.setState({ searchBar: e.target.value });
    };

    handleSearchSubmit = () => {
        this.props.onSearchSubmit(this.state.searchBar);
    };

    render() {
        return (
            <div className={styles.Searchbar}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    this.handleSearchSubmit();
                }
                } className={styles.SearchForm}>
                    <button type="submit" className={styles.SearchFormButton} >Search</button>
                    <input
                        className={styles.SearchFormInput}
                        type="text"
                        value={this.state.searchBar}
                        onChange={this.handleInputChange}
                    />
                </form>

            </div >
        );
    }
}

Searchbar.propTypes = {
    onSearchSubmit: PropTypes.func.isRequired
}


export default Searchbar;

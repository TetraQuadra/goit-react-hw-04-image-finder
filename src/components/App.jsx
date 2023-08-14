import React, { Component } from "react";
import getData from "services/getData";
import Button from "./button/Button";
import ImageGallery from "./imageGallery/ImageGallery";
import Loader from "./loader/Loader";
import Modal from "./modal/Modal";
import Searchbar from "./searchbar/Searchbar";

export class App extends Component {
  state = {
    images: [],
    showLoader: true,
    currentPage: 1,
    searchBar: "",
    totalHits: '',
    selectedImage: null,
  };

  searchSubmit = async (text) => {
    if (text === this.state.searchBar) {
      return
    }
    this.setState({
      searchBar: text,
      images: [],
      currentPage: 1,
    });
  };

  loadMore = () => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + 1,
    }));
  };

  handleImageClick = (largeImageURL) => {
    this.setState({ selectedImage: largeImageURL });
    window.addEventListener("keydown", this.handleEsc);
  };

  handleCloseModal = () => {
    this.setState({ selectedImage: null });
    window.removeEventListener("keydown", this.handleEsc);
  };

  handleEsc = (event) => {
    if (event.keyCode === 27) {
      this.handleCloseModal();
    }
  };

  loadImages = () => {
    this.setState({ showLoader: true });
    const imageElements = document.querySelectorAll("img");
    let imagesLoaded = 0;
    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === imageElements.length) {
        this.setState({ showLoader: false });
      }
    };

    imageElements.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
      }
    });
  };

  handleSearch = async () => {
    this.setState({ showLoader: true });
    const response = await getData(this.state.searchBar);
    if (response?.totalHits > 0) {
      this.setState(
        {
          images: response.hits,
          totalHits: response.totalHits,
        },
        () => {
          this.loadImages();
        }
      );
    }
    else {
      alert('nothing found')
      this.setState({ showLoader: false });
    }
  };

  handleLoadMoreImages = async () => {
    const response = await getData(
      this.state.searchBar,
      this.state.currentPage
    );
    if (response?.totalHits) {
      this.setState(
        (prevState) => ({
          images: [...prevState.images, ...response.hits],
        }),
        () => {
          this.loadImages();
        }
      );
    }
  }

  componentDidMount() {
    this.searchSubmit("car");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchBar !== prevState.searchBar) {
      this.handleSearch();
    }
    if (this.state.currentPage !== prevState.currentPage && this.state.currentPage !== 1) {
      this.handleLoadMoreImages();
    }
  }

  render() {
    const { images, showLoader, totalHits, selectedImage } = this.state;
    return (
      <div className="App">
        <header>
          <Searchbar onSearchSubmit={this.searchSubmit} />
        </header>
        <main>
          {showLoader && <Loader />}
          <>
            <ImageGallery images={images} handleImageClick={this.handleImageClick} />
            {images.length < totalHits && !showLoader && images.length > 0 && <Button loadMore={this.loadMore} />}
          </>
        </main>
        {selectedImage && (
          <Modal
            imageUrl={selectedImage}
            altText="Selected Image"
            handleCloseModal={this.handleCloseModal}
          />
        )}
      </div>
    );
  }
}

export default App;

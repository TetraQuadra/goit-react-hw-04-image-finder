import React, { useState, useEffect } from "react";
import getData from "services/getData";
import Button from "./button/Button";
import ImageGallery from "./imageGallery/ImageGallery";
import Loader from "./loader/Loader";
import Modal from "./modal/Modal";
import Searchbar from "./searchbar/Searchbar";

const App = () => {
  const [images, setImages] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBar, setSearchBar] = useState("");
  const [totalHits, setTotalHits] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const searchSubmit = (text) => {
    if (text === searchBar) {
      return;
    }
    setSearchBar(text);
    setImages([]);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleImageClick = (largeImageURL) => {
    setSelectedImage(largeImageURL);
    window.addEventListener("keydown", handleEsc);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    window.removeEventListener("keydown", handleEsc);
  };

  const handleEsc = (event) => {
    if (event.keyCode === 27) {
      handleCloseModal();
    }
  };

  const loadImages = () => {
    setShowLoader(true);
    const imageElements = document.querySelectorAll("img");
    let imagesLoaded = 0;
    const handleImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === imageElements.length) {
        setShowLoader(false);
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

  const handleSearch = async () => {
    setShowLoader(true);
    const response = await getData(searchBar);
    if (response?.totalHits > 0) {
      setImages(response.hits);
      setTotalHits(response.totalHits);
    } else {
      alert('Nothing found');
      setShowLoader(false);
    }
  };

  const handleLoadMoreImages = async () => {
    const response = await getData(searchBar, currentPage);
    if (response?.totalHits) {
      setImages((prevImages) => [...prevImages, ...response.hits]);
      loadImages();
    }
  };

  useEffect(() => {
    searchSubmit("car");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchBar !== "") {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [searchBar]);

  useEffect(() => {
    if (currentPage !== 1) {
      handleLoadMoreImages();
    }
    // eslint-disable-next-line
  }, [currentPage]);

  useEffect(() => loadImages(), [images])

  return (
    <div className="App">
      <header>
        <Searchbar onSearchSubmit={searchSubmit} />
      </header>
      <main>
        {showLoader && <Loader />}
        <>
          <ImageGallery images={images} handleImageClick={handleImageClick} />
          {images.length < totalHits && !showLoader && images.length > 0 && <Button loadMore={loadMore} />}
        </>
      </main>
      {selectedImage && (
        <Modal
          imageUrl={selectedImage}
          altText="Selected Image"
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;

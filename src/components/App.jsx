import React, { useState, useEffect } from "react";
import { useRef } from "react";
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

  useEffect(() => {
    const handleLoadMoreImages = async () => {
      const response = await getData(searchBar, currentPage);
      if (response?.totalHits) {
        setImages((prevImages) => [...prevImages, ...response.hits]);
        loadImages();
      }
    };

    const handleSearch = async () => {
      setShowLoader(true);
      const response = await getData(searchBar);
      if (response?.totalHits > 0) {
        setImages(response.hits);
        setTotalHits(response.totalHits);
      } else {
        alert("Nothing found");
        setShowLoader(false);
      }
    };

    if (searchBar !== "" && searchBar !== prevSearchBar.current) {
      handleSearch();
      prevSearchBar.current = searchBar;
    }

    if (currentPage !== 1 && currentPage !== prevCurrentPage.current) {
      handleLoadMoreImages();
      prevCurrentPage.current = currentPage;
    }
  }, [searchBar, currentPage]);

  useEffect(() => {
    setSearchBar("car");
  }, []);

  useEffect(() => loadImages(), [images]);

  const prevSearchBar = useRef(searchBar);
  const prevCurrentPage = useRef(currentPage);

  return (
    <div className="App">
      <header>
        <Searchbar onSearchSubmit={searchSubmit} />
      </header>
      <main>
        {showLoader && <Loader />}
        <ImageGallery images={images} handleImageClick={handleImageClick} />
        {images.length < totalHits && !showLoader && images.length > 0 && <Button loadMore={loadMore} />}
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
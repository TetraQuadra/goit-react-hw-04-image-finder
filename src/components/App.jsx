import React, { useState, useEffect } from "react";
import getData from "services/getData";
import Button from "./button/Button";
import ImageGallery from "./imageGallery/ImageGallery";
import Loader from "./loader/Loader";
import Modal from "./modal/Modal";
import Searchbar from "./searchbar/Searchbar";

const App = () => {
  const [images, setImages] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchBar, setSearchBar] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showMore, setShowMore] = useState(false)

  const searchSubmit = (text) => {
    //in case user sends empty request
    if (text === '') {
      alert('Your request is empty')
      return
    }
    if (text !== searchBar) {
      setImages([]);
      setSearchBar(text);
      setCurrentPage(1);
    }
    // user need to know that request is handled some way or another, i choosed alert instead of rerender same request
    if (text === searchBar) {
      alert(`Request "${text}" already loaded`)
    }
  };

  const loadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleImageClick = (largeImageURL) => {
    setSelectedImage(largeImageURL);

  };

  const handleCloseModal = () => {
    setSelectedImage(null);
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
    const handleSearch = async () => {
      setShowLoader(true);
      const response = await getData(searchBar, currentPage);
      try {
        setImages(prev => [...prev, ...response.hits]);
        setShowMore(currentPage < Math.ceil(response.totalHits / 12))
      }
      catch {
        alert("Nothing found");
      }
      finally {
        setShowLoader(false);
      }
    };
    if (searchBar !== "") {
      handleSearch();
    }

  }, [searchBar, currentPage]);

  useEffect(() => {
    setSearchBar("car", 1);
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      return
    }
    loadImages()
  }, [images]);

  return (
    <div className="App">
      <header>
        <Searchbar onSearchSubmit={searchSubmit} />
      </header>
      <main>
        {showLoader && <Loader />}
        <ImageGallery images={images} handleImageClick={handleImageClick} />
        {showMore && <Button loadMore={loadMore} />}
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

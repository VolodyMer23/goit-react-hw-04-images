import { useEffect, useState } from 'react';
import fetchImages from 'services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import LoadMoreButton from './Button/Button';
import Loader from './Loader/Loader';
import { AppContainer } from './App.styled';

import React from 'react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [alt, setAlt] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error] = useState(null);
  const [totalHits, setTotalHits] = useState(null);

  const onFormSubmit = formSearchQuery => {
    if (formSearchQuery === searchQuery) {
      return;
    }
    resetState();
    setSearchQuery(formSearchQuery);
  };

  const resetState = () => {
    setSearchQuery('');
    setImages([]);
    setPage(1);
    setSelectedImage(null);
    setAlt(null);
    setStatus('idle');
  };

  const handleSelectedImage = (largeImageUrl, tags) => {
    setSelectedImage(largeImageUrl);
    setAlt(tags);
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const loadMore = () => {
    setPage(prevValue => prevValue + 1);
  };

  useEffect(() => {
    const getImages = async (searchQuery, page) => {
      setStatus('pending');
      try {
        const imagesData = await fetchImages(searchQuery, page);
        setTotalHits(imagesData.total);
        const imageHits = imagesData.hits;

        if (!imageHits.length) {
          toast.warning('No images were found, try something else');
        }

        setImages([...images, ...imageHits]);
        setStatus('resolved');
      } catch (error) {
        toast.error(`Sorry something went wrong. ${error.message}`);
        setStatus('rejected');
      }
    };
    if (!searchQuery) return;
    getImages(searchQuery, page);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  return (
    <AppContainer>
      <SearchBar onSubmit={onFormSubmit} />
      <ToastContainer autoClose={2000} theme="colored" pauseOnHover />
      {status === 'pending' && <Loader />}
      {error && (
        <h1 style={{ color: 'grey', textAlign: 'center' }}>{error.message}</h1>
      )}
      <ImageGallery
        images={images}
        selectedImage={handleSelectedImage}
      ></ImageGallery>
      {images.length > 0 && images.length !== totalHits && (
        <LoadMoreButton onClick={loadMore} />
      )}

      {selectedImage && (
        <Modal selectedImage={selectedImage} tags={alt} onClose={closeModal} />
      )}
    </AppContainer>
  );
}

export default App;

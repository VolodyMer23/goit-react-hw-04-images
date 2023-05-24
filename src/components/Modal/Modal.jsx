import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { ModalOverlay, ModalContainer, Img } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

function Modal({ selectedImage, tags, onClose }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    }, [selectedImage]);

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      window.removeEventListener('keydown', handleKeyDown);
      onClose();
    }
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      window.removeEventListener('keydown', handleKeyDown);
      onClose();
    }
  };

  return createPortal(
    <ModalOverlay onClick={handleBackdropClick}>
      <ModalContainer>
        <Img src={selectedImage} alt={tags} />
      </ModalContainer>
    </ModalOverlay>,
    modalRoot
  );
}

export default Modal;

Modal.propTypes = {
  selectedImage: PropTypes.string,
  tags: PropTypes.string,
  onClose: PropTypes.func,
};

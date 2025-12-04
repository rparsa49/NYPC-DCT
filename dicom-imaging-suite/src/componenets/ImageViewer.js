import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ImageViewer = ({
  highImages,
  lowImages,
  currentIndex: propIndex,
  handleNextImage,
  handlePreviousImage,
}) => {
  // Use props for index/handlers if provided (controlled mode), otherwise use local state
  const [localIndex, setLocalIndex] = useState(0);

  const isControlled = propIndex !== undefined;
  const currentIndex = isControlled ? propIndex : localIndex;

  // For SECT, lowImages might be empty. Total is based on High images.
  const totalImages = highImages ? highImages.length : 0;
  const isSECT = !lowImages || lowImages.length === 0;

  // Adjust the base URL to include the processed_images directory
  const baseURL = "http://127.0.0.1:5050";

  const onNext = () => {
    if (isControlled && handleNextImage) {
      handleNextImage();
    } else {
      setLocalIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const onPrev = () => {
    if (isControlled && handlePreviousImage) {
      handlePreviousImage();
    } else {
      setLocalIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }
  };

  if (totalImages === 0) {
    return <p>No images available.</p>;
  }

  // Safety check to prevent crash if index is out of bounds during switch
  if (currentIndex >= totalImages) {
    return <p>Loading...</p>;
  }

  return (
    <ViewerContainer>
      <Button onClick={onPrev}>◀</Button>
      <ImageContainer>
          <Image src={`${baseURL}${highImages[currentIndex]}`} alt="High kVp" />

        {!isSECT && (
            <Image src={`${baseURL}${lowImages[currentIndex]}`} alt="Low kVp" />
        )}
      </ImageContainer>
      <Button onClick={onNext}>▶</Button>
      <Counter>
        {currentIndex + 1} / {totalImages}
      </Counter>
    </ViewerContainer>
  );
};

export default ImageViewer;

// Styled components
const ViewerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  max-width: 300px;
  max-height: 300px;
  border-radius: 10px;
  margin: 0 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  background: #ff6bcb;
  color: white;
  border: none;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s;

  &:hover {
    background: #ff6bcb;
  }
`;

const Counter = styled.div`
  color: #333;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  // margin-top: 10px;
`;

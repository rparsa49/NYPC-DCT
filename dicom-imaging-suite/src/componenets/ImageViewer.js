import React, { useState } from "react";
import styled from "styled-components";

const ImageViewer = ({ highImages, lowImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = Math.min(highImages.length, lowImages.length);

  // Adjust the base URL to include the processed_images directory
  const baseURL = "http://127.0.0.1:5050";

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  if (totalImages === 0) {
    return <p>No images available.</p>;
  }

  return (
    <ViewerContainer>
      <Button onClick={handlePrevious}>◀</Button>
      <ImageContainer>
        <Image src={`${baseURL}${highImages[currentIndex]}`} alt="High kVp" />
        <Image src={`${baseURL}${lowImages[currentIndex]}`} alt="Low kVp" />
      </ImageContainer>
      <Button onClick={handleNext}>▶</Button>
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

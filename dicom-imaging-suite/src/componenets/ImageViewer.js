import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ImageViewer = ({
  highImages,
  lowImages,
  currentIndex = 0,
  setImageIndex,
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const totalImages = highImages ? highImages.length : 0;
  const isSECT = !lowImages || lowImages.length === 0;
  const baseURL = "http://127.0.0.1:5050";

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  const onSliderChange = (e) => {
    const newIndex = parseInt(e.target.value, 10);
    setActiveIndex(newIndex);
    if (setImageIndex) {
      setImageIndex(newIndex);
    }
  };

  if (totalImages === 0) return <p>No images available.</p>;

  const safeIndex = Math.min(activeIndex, totalImages - 1);

  const progressPercent =
    totalImages > 1 ? (safeIndex / (totalImages - 1)) * 100 : 0;

  return (
    <ViewerCard>
      <ImageDisplayArea>
        <Image src={`${baseURL}${highImages[safeIndex]}`} alt="High kVp" />
        {!isSECT && (
          <Image src={`${baseURL}${lowImages[safeIndex]}`} alt="Low kVp" />
        )}
      </ImageDisplayArea>

      <ControlsBar>
        <SliderContainer>
          <Slider
            $progress={progressPercent}
            min="0"
            max={totalImages - 1}
            value={safeIndex}
            onChange={onSliderChange}
          />
        </SliderContainer>
        <CounterPill>
          {safeIndex + 1} / {totalImages}
        </CounterPill>
      </ControlsBar>
    </ViewerCard>
  );
};

export default ImageViewer;

const ViewerCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 24px;
  padding: 30px;
  max-width: 700px;
`;

const ImageDisplayArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const Image = styled.img`
  max-width: 280px;
  max-height: 280px;
  border-radius: 16px;
  margin: 0 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  user-select: none;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const ControlsBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 10px;
`;

const SliderContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

const CounterPill = styled.div`
  background: #f0f2f5;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  white-space: nowrap;
`;

const Slider = styled.input.attrs({ type: "range" })`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px; /* A thinner, sleeker track */
  border-radius: 10px;
  outline: none;
  cursor: pointer;

  background: linear-gradient(
    to right,
    #ff6bcb 0%,
    #ff6bcb ${(props) => props.$progress}%,
    #e0e0e0 ${(props) => props.$progress}%,
    #e0e0e0 100%
  );

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #ff6bcb; 
    border: 3px solid #fff; 
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* Soft shadow */
    transition: all 0.2s ease;
    margin-top: -3px;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 107, 203, 0.5); 
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #ff6bcb;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
    box-sizing: border-box; 
  }

  &::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 107, 203, 0.5);
  }
`;

// ViewerSection.js
import React from "react";
import styled from "styled-components";
import ImageViewer from "./ImageViewer";
import { FaHome } from "react-icons/fa";

const ViewerSection = ({
  highImages,
  lowImages,
  currentIndex,
  handleNextImage,
  handlePreviousImage,
  cleanNoise,
  phantomType,
  setPhantomType,
  circleRadius,
  handleRadiusChange,
  highKVP,
  handleHighKVPChange,
  lowKVP,
  handleLowKVPChange,
  sliceThickness,
  handleSliceThicknessChange,
  selectedModel,
  setSelectedModel,
  models,
  handleCalculate,
  handleHome,
}) => {
  return (
    <>
      <Header>
        <UtilityButton onClick={handleHome}>
          <FaHome />
        </UtilityButton>
        <h1>DECT Scan Viewer</h1>
      </Header>
      <ImageViewer
        highImages={highImages}
        lowImages={lowImages}
        currentIndex={currentIndex}
        handleNextImage={handleNextImage}
        handlePreviousImage={handlePreviousImage}
      />
      <ButtonGroup>
        <SecondaryButton onClick={cleanNoise}>Clean Noise ✨</SecondaryButton>
      </ButtonGroup>
      <ControlsContainer>
        <ControlGroup>
          <SelectContainer>
            <label>Phantom Type:</label>
            <Select
              value={phantomType}
              onChange={(e) => setPhantomType(e.target.value)}
            >
              <option value="head">Head</option>
              <option value="body">Body</option>
              <option value="3d-head 0-ring">3D-Head 0-Ring</option>
              <option value="3d-head 1-ring">3D-Head 1-Ring</option>
              <option value="3d-head 2-ring">3D-Head 2-Ring</option>
              <option value="3d-head 3-ring">3D-Head 3-Ring</option>
              <option value="3d-head 4-ring">3D-Head 4-Ring</option>
            </Select>
          </SelectContainer>
          <SelectContainer>
            <label>Select Model:</label>
            <Select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </Select>
          </SelectContainer>
        </ControlGroup>
        <ControlGroup>
          <SliderContainer>
            <label>Circle Radius: {circleRadius}px</label>
            <RadiusSlider
              type="range"
              min="1"
              max="100"
              value={circleRadius}
              onChange={handleRadiusChange}
            />
          </SliderContainer>
          <SliderContainer>
            <label>High KVP: {highKVP} KVP</label>
            <RadiusSlider
              type="range"
              min="10"
              max="200"
              step={10}
              value={highKVP}
              onChange={handleHighKVPChange}
            />
          </SliderContainer>
          <SliderContainer>
            <label>Low KVP: {lowKVP} KVP</label>
            <RadiusSlider
              type="range"
              min="10"
              max="200"
              step={10}
              value={lowKVP}
              onChange={handleLowKVPChange}
            />
          </SliderContainer>
          <SliderContainer>
            <label>Slice Thickness : {sliceThickness} mm</label>
            <RadiusSlider
              type="range"
              min="0"
              max="20"
              step={0.5}
              value={sliceThickness}
              onChange={handleSliceThicknessChange}
            />
          </SliderContainer>
        </ControlGroup>
      </ControlsContainer>
      <ButtonGroup>
        <MainButton onClick={handleCalculate}>
          Calculate Stopping Power
        </MainButton>
      </ButtonGroup>
    </>
  );
};

export default ViewerSection;

// Styled components
const Header = styled.div`
  margin-bottom: 20px;
  position: relative;
  width: 100%;
`;

const UtilityButton = styled.button`
  position: absolute;
  top: 10px;
  left: 20px;
  background: #f0f0f0;
  color: #1f2a48;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #e0e0e0;
    transform: scale(1.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
`;

const MainButton = styled.button`
  background: #ff6bcb;
  color: white;
  padding: 15px 25px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0px 8px 15px rgba(255, 107, 203, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 12px 20px rgba(255, 107, 203, 0.6);
  }
`;

const SecondaryButton = styled.button`
  background: #6bbaff;
  color: white;
  padding: 15px 25px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0px 8px 15px rgba(107, 154, 255, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 12px 20px rgba(107, 154, 255, 0.6);
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff6bcb;
  min-width: 250px;
`;

const RadiusSlider = styled.input`
  width: 100%;
  max-width: 200px;
  margin-top: 10px;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff6bcb;
`;

const Select = styled.select`
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ff6bcb;
  color: #ff6bcb;
  background-color: #fff;
  font-size: 16px;
`;

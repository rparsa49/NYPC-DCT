// ResultsSection.js
import React from "react";
import styled from "styled-components";
import TestResultsTable from "./TestResultsTable";
import { FaHome } from "react-icons/fa";

const TestResultsSection = ({
  results,
  selectedModel,
  handleBack,
  handleHome,
  downloadResultsAsCSV,
  sprMapUrl,

}) => {
  return (
    <ResultsContainer>
      <ButtonGroup>
        <UtilityButton onClick={handleBack}>←</UtilityButton>
        <UtilityButton onClick={handleHome}>
          <FaHome />
        </UtilityButton>
        <UtilityButton onClick={downloadResultsAsCSV}>💾</UtilityButton>
      </ButtonGroup>
      {sprMapUrl && (
        <SprCard>
          <SprTitle>SPR Map</SprTitle>
          <SprImg src={sprMapUrl} alt="SPR Map" />
        </SprCard>
      )}
      <TestResultsTable results={results} selectedModel={selectedModel} />
    </ResultsContainer>
  );
};

export default TestResultsSection;

// Styled components
const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const UtilityButton = styled.button`
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

const ToggleCompareButton = styled.button`
  margin-top: 20px;
  background: #ffb347;
  color: #1f2a48;
  padding: 10px 20px;
  font-size: 15px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #ffa500;
  }
`;

const AnimatedCompareMenu = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #ff6bcb;
  border-radius: 15px;
  animation: fadeIn 0.3s ease-in-out;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const SelectContainer = styled.div`
  margin: 20px 0;
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

const SliderContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff6bcb;
`;

const RadiusSlider = styled.input`
  width: 200px;
  margin-top: 10px;
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

const SprCard = styled.div`
  width: 100%;
  max-width: 720px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 12px 12px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SprTitle = styled.h3`
  margin: 6px 0 12px;
  color: #ff6bcb;
  font-weight: 600;
`;

const SprImg = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.35);
`;
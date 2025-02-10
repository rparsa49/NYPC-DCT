import React from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

const HelpModal = ({ onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <AiOutlineClose size={24} />
        </CloseButton>
        <Title>How to Use the App</Title>
        <Description>
          Click "Upload Series" to upload your DICOM scans for calibration. Once calibrated, you can upload further scans to test the calibration settings.
        </Description>
      </ModalContent>
    </ModalOverlay>
  );
};

export default HelpModal;

// Styled components for the modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
  color: #e0eafc;
  font-family: Arial, sans-serif;
  position: relative;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 1;
  transform: scale(1);

  &:hover {
    transform: scale(1.02);
    opacity: 0.95;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  color: #ff6bcb;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #c0d0f0;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #ff6bcb;
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

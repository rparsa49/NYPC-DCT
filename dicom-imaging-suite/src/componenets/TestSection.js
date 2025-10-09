// TestSection.js
import React, { useState } from "react";
import styled from "styled-components";
import { FaHome } from "react-icons/fa";

const TestSection = ({ handleTestUpload, uploadStatus, handleBack }) => {
  const [dicomFiles, setDicomFiles] = useState(null);
  const [calibrationFile, setCalibrationFile] = useState(null);

  const onTest = () => {
    if (dicomFiles && calibrationFile) {
      handleTestUpload(dicomFiles, calibrationFile);
    } else {
      window.alert("Please upload both a DICOM folder and a calibration file.");
    }
  };

  return (
    <>
      <BackButton onClick={handleBack}>←</BackButton>
      <Title>Test with a Calibration File</Title>
      <Subtitle>
        Apply a previously saved calibration to a new dataset.
      </Subtitle>
      <UploadContainer>
        <UploadButton
          onClick={() => document.getElementById("dicomFolderInput").click()}
        >
          Upload DICOM Series
        </UploadButton>
        <input
          type="file"
          id="dicomFolderInput"
          webkitdirectory="true"
          directory="true"
          style={{ display: "none" }}
          onChange={(e) => setDicomFiles(e.target.files)}
        />
        {dicomFiles && <p>✅ DICOM Folder Selected</p>}
      </UploadContainer>
      <UploadContainer>
        <UploadButton
          onClick={() => document.getElementById("calibrationInput").click()}
        >
          Upload Calibration JSON
        </UploadButton>
        <input
          type="file"
          id="calibrationInput"
          accept=".json"
          style={{ display: "none" }}
          onChange={(e) => setCalibrationFile(e.target.files[0])}
        />
        {calibrationFile && <p>✅ {calibrationFile.name}</p>}
      </UploadContainer>
      <MainButton onClick={onTest}>Run Test</MainButton>
      {uploadStatus && <StatusMessage>{uploadStatus}</StatusMessage>}
    </>
  );
};

export default TestSection;

// Styled components
const BackButton = styled.button`
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

const Title = styled.h1`
  font-size: 28px;
  color: #e0eafc;
  margin-bottom: 10px;
`;

const Subtitle = styled.h2`
  font-size: 16px;
  font-weight: 300;
  color: #a0b9e4;
  margin-bottom: 30px;
`;

const UploadContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const UploadButton = styled.button`
  background: #ff6bcb;
  color: white;
  padding: 15px 25px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0px 8px 15px rgba(255, 107, 203, 0.4);
  margin-bottom: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 12px 20px rgba(255, 107, 203, 0.6);
  }
`;

const MainButton = styled(UploadButton)`
  background: #6bbaff;
`;

const StatusMessage = styled.p`
  color: #ff6bcb;
  margin-top: 20px;
`;

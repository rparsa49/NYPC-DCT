import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HelpModal from "./HelpModal";
import { AiOutlineArrowLeft, AiOutlineQuestionCircle } from "react-icons/ai";
import { FaBrain } from "react-icons/fa";
import ImageViewer from "./ImageViewer";
import LoadingSpinner from "./LoadingSpinner";

const LoadingPage = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImagesReady, setIsImagesReady] = useState(false);
  const [highImages, setHighImages] = useState([]);
  const [lowImages, setLowImages] = useState([]);
  const [sliceThickness, setSliceThickness] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [circleRadius, setCircleRadius] = useState(10);
  const [phantomType, setPhantomType] = useState("head");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5050/get-supported-models")
      .then((response) => response.json())
      .then((data) => {
        const modelOptions = Object.keys(data).map((key) => ({
          name: key,
        }));
        setModels(modelOptions);
        setSelectedModel(modelOptions[0]?.name || "");
      })
      .catch((error) => console.error("Failed to fetch models:", error));
  }, []);

  const handleFolderChange = async (event) => {
    setIsLoading(true);
    const files = event.target.files;
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("files", file, file.webkitRelativePath);
    });

    try {
      const response = await fetch("http://127.0.0.1:5050/upload-scan", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setUploadStatus("Upload successful!");
      setHighImages(result.high_kvp_images);
      setLowImages(result.low_kvp_images);
      setSliceThickness(result.slice_thickness);
      setIsImagesReady(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculate = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5050/analyze-inserts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          radius: circleRadius,
          phantom: phantomType,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const analysisResult = await response.json();
      setResults(analysisResult.results);
    } catch (error) {
      console.error("Failed to calculate stopping power:", error);
    }
  };

  const handleNextImage = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex + 1) % Math.min(highImages.length, lowImages.length)
    );
  };

  const handlePreviousImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.min(highImages.length, lowImages.length) - 1
        : prevIndex - 1
    );
  };

  const handleRadiusChange = async (event) => {
    const newRadius = event.target.value;
    setCircleRadius(newRadius);

    try {
      const response = await fetch(`http://127.0.0.1:5050/update-circles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          radius: newRadius,
          phantom_type: phantomType,
          high_kvp_images: highImages,
          low_kvp_images: lowImages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setHighImages(result.updated_high_kvp_images);
      setLowImages(result.updated_low_kvp_images);
    } catch (error) {
      console.error("Failed to update circle radius:", error);
    }
  };

  return (
    <Background>
      <Content>
        {isLoading && <LoadingSpinner />}

        {!isImagesReady && !isLoading && (
          <>
            <BrainIcon />
            <Title>DECT Imaging Suite</Title>
            <Subtitle>Analyze and process DECT scans with ease</Subtitle>
            <input
              type="file"
              id="folderInput"
              webkitdirectory="true"
              directory="true"
              style={{ display: "none" }}
              onChange={handleFolderChange}
            />
            <UploadButton
              onClick={() => document.getElementById("folderInput").click()}
            >
              Upload DICOM Series
            </UploadButton>
            {uploadStatus && <StatusMessage>{uploadStatus}</StatusMessage>}
            <HelpButton onClick={() => setShowHelp(true)}>
              <AiOutlineQuestionCircle size={24} />
            </HelpButton>
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
          </>
        )}

        {isImagesReady && results.length === 0 && (
          <>
            <Header>
              <h1>DECT Scan Viewer</h1>
              <SliceInfo>Slice Thickness: {sliceThickness} mm</SliceInfo>
            </Header>
            <ImageViewer
              highImages={highImages}
              lowImages={lowImages}
              currentIndex={currentIndex}
              handleNextImage={handleNextImage}
              handlePreviousImage={handlePreviousImage}
            />
            <SelectContainer>
              <label>Phantom Type:</label>
              <Select
                value={phantomType}
                onChange={(e) => setPhantomType(e.target.value)}
              >
                <option value="head">Head</option>
                <option value="body">Body</option>
              </Select>
            </SelectContainer>
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
            <SelectContainer>
              <label>Select Model:</label>
              <Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {models.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.name} - {model.description}
                  </option>
                ))}
              </Select>
            </SelectContainer>
            <CalculateButton onClick={handleCalculate}>
              Calculate Stopping Power
            </CalculateButton>
          </>
        )}

        {results.length > 0 && (
          <ResultsTable>
            <thead>
              <tr>
                <TableHeader>Insert #</TableHeader>
                <TableHeader>Material</TableHeader>
                <TableHeader>ρ_e</TableHeader>
                <TableHeader>Z_eff</TableHeader>
                <TableHeader>Stopping Power Ratio</TableHeader>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{result.material}</TableCell>
                  <TableCell>{result.rho_e.toFixed(2)}</TableCell>
                  <TableCell>{result.z_eff.toFixed(2)}</TableCell>
                  <TableCell>{result.stopping_power.toFixed(2)}</TableCell>
                </tr>
              ))}
            </tbody>
          </ResultsTable>
        )}
      </Content>
    </Background>
  );
};

export default LoadingPage;

// Styled components
const Background = styled.div`
  background: linear-gradient(135deg, #1f2a48, #3e5b99);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e0eafc;
  font-family: Arial, sans-serif;
`;

const Content = styled.div`
  text-align: center;
  position: relative;
  max-width: 800px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
`;

const BrainIcon = styled(FaBrain)`
  color: #ff6bcb;
  font-size: 80px;
  margin-bottom: 20px;
  animation: rotate 6s infinite linear;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
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

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 12px 20px rgba(255, 107, 203, 0.6);
  }
`;

const StatusMessage = styled.p`
  color: #ff6bcb;
  margin-top: 20px;
`;

const HelpButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #ff6bcb;
  font-size: 24px;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const SliceInfo = styled.p`
  color: #ff6bcb;
  font-size: 18px;
  margin-top: 10px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: #ff6bcb;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: #ff4bb2;
    transform: scale(1.1);
  }
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

const CalculateButton = styled.button`
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
const ResultsTable = styled.table`
  width: 100%;
  margin-top: 20px;
  color: #e0eafc;
  border-collapse: collapse;
  font-size: 16px;
`;

const TableHeader = styled.th`
  padding: 10px;
  background: #ff6bcb;
  color: white;
  text-align: center;
`;

const TableCell = styled.td`
  padding: 10px;
  border-top: 1px solid #ff6bcb;
  text-align: center;
`;

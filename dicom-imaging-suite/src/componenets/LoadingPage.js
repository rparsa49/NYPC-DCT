import React, { useState, useEffect } from "react";
import styled from "styled-components";
import HelpModal from "./HelpModal";
import { AiOutlineQuestionCircle } from "react-icons/ai";
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
  const [sliceThickness, setSliceThickness] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [circleRadius, setCircleRadius] = useState(10);
  const [phantomType, setPhantomType] = useState("head");
  // const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [results, setResults] = useState([]);
  const [highKVP, setHighKVP] = useState(0);
  const [lowKVP, setLowKVP] = useState(0);

//   useEffect(() => {
//   fetch("http://127.0.0.1:5050/get-supported-models")
//     .then((response) => response.json())
//     .then((data) => {
//       const modelOptions = Object.entries(data).map(([key, value]) => ({
//         name: value.name, 
//       }));

//       setModels(modelOptions);
//       setSelectedModel(modelOptions[0]?.name || "");
//     })
//     .catch((error) => console.error("Failed to fetch models:", error));
// }, []);

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
      console.log("Selected Model:", selectedModel);

      const response = await fetch("http://127.0.0.1:5050/analyze-inserts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          radius: circleRadius,
          phantom: phantomType,
          highKVP: highKVP,
          lowKVP: lowKVP, 
          sliceThickness: sliceThickness
          // model: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const analysisResult = await response.json();

      // Log the full analysis result
      console.log("Analysis Result:", analysisResult);

      // Ensure z_eff and stopping_power are correctly formatted
      const processedResults = analysisResult.results.map((res, index) => ({
        material: res.material,
        rho_e: res.rho_e,
        z_eff: Array.isArray(res.z_eff) ? res.z_eff[index] : res.z_eff, // Handle array or single value
        stopping_power: Array.isArray(res.stopping_power)
          ? res.stopping_power[index]
          : res.stopping_power
      }));

      console.log("Processed Results:", processedResults);

      setResults(processedResults);
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


  const handleBack = () => {
    setIsImagesReady(false);
    setResults([]);
    setUploadStatus(null);
    setHighImages([]);
    setLowImages([]);
    setSliceThickness(null);
    setCircleRadius(100);
    };

  // Setting user input for parameters
  const handleHighKVPChange = async (event) => {
    setHighKVP(event.target.value);
  };

  const handleLowKVPChange = async (event) => {
    setLowKVP(event.target.value);
  };

  const handleSliceThicknessChange = async (event) => {
    setSliceThickness(event.target.value);
  }

  // START UI
  return (
    // Start page
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
        {/* Tool page */}
        {isImagesReady && results.length === 0 && (
          <>
            <Header>
              <h1>DECT Scan Viewer</h1>
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
            {/* <SelectContainer>
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
            </SelectContainer> */}
            <CalculateButton onClick={handleCalculate}>
              Calculate Stopping Power
            </CalculateButton>
          </>
        )}
        {/* Result page */}
        {results.length > 0 && (
          <>
            <BackButton onClick={handleBack}> ← </BackButton>
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
                    <TableCell>
                      {typeof result.z_eff === "number" && !isNaN(result.z_eff)
                        ? result.z_eff.toFixed(2)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {typeof result.stopping_power === "number" &&
                      !isNaN(result.stopping_power)
                        ? result.stopping_power.toFixed(5)
                        : "N/A"}
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </ResultsTable>
            <></>{" "}
          </>
        )}
      </Content>
      <Footer>
        <FooterText>© 2025 DECT Imaging Suite. All rights reserved.</FooterText>
      </Footer>
    </Background>
  );
};

export default LoadingPage;

// Styled components
const Background = styled.div`
  background: linear-gradient(135deg, #1f2a48, #3e5b99);
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e0eafc;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
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
  top: 10px;
  left: 20px;
  background: #ff6bcb;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
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

const TestingButton = styled.button`
  background: #6bcbff;
  color: white;
  padding: 15px 25px;
  font-size: 16px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0px 8px 15px rgba(107, 203, 255, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 12px 20px rgba(107, 203, 255, 0.6);
  }
`;

const Footer = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: linear-gradient(135deg, #1f2a48, #3e5b99);
  color: #e0eafc;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  box-shadow: 0px -5px 10px rgba(0, 0, 0, 0.2);
`;

const FooterText = styled.p`
  margin: 0;
`;
import React from "react";
import { Routes, Route } from "react-router-dom";
import ImageViewer from "./componenets/ImageViewer"
import LoadingPage from "./componenets/LoadingPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoadingPage />} />
      <Route path="/view-images" element={<ImageViewer />} />
    </Routes>
  );
}

export default App;

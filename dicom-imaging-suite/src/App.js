import React from "react";
import { Routes, Route } from "react-router-dom";
import ImageViewer from "./componenets/ImageViewer"
import LoadingPage from "./componenets/LoadingPage"
import MainPage from "./componenets/MainPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/view-images" element={<ImageViewer />} />
    </Routes>
  );
}

export default App;

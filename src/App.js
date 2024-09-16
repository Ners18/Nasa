import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainContent from "./components/MainContent";
import Asset from "./components/asset";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/Nasa" element={<MainContent />} />
          <Route path="/asset/:id" element={<Asset />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;

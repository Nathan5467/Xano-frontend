import React from "react";
import Navbar from "./components/Navbar";
import StockIndices from "./components/StockIndices";
import User_lists from "./components/User_lists";

function App() {
  return (
    <div className="container-fluid">
      <Navbar />
      <StockIndices />
      <User_lists />
    </div>
  );
}

export default App;

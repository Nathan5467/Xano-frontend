import React from "react";
import Navbar from "./components/Navbar";
import StockIndices from "./components/StockIndices";
import Watchlist from "./components/Watchlist";
import Portfolio from "./components/Portfolio";

function App() {
  return (
    <div className="container-fluid">
      <Navbar />
      <StockIndices />
      <div className="row">
        <div className="col-md-9">
          <Portfolio />
        </div>
        <div className="col-md-3">
          <Watchlist />
        </div>
      </div>
    </div>
  );
}

export default App;

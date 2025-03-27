import React from "react";
import Navbar from "./components/Navbar";
import StockIndices from "./components/StockIndices";
import Watchlist from "./components/Watchlist";
import Admin_dashboard from "./components/Admin_dashboard";
import Portfolio from "./components/Portfolio";

function App() {
  return (
    <div className="container-fluid">
      <Navbar />
      <StockIndices />
      <div className="row">
        <div className="col-md-9">
          <Admin_dashboard />
        </div>
        <div className="col-md-3">
          <Watchlist />
        </div>
      </div>
    </div>
  );
}

export default App;

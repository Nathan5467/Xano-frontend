import React from "react";
import Navbar from "./components/Navbar";
import StockIndices from "./components/StockIndices";
import Watchlist from "./components/Watchlist";
//import Admin_dashboard from "./components/Admin_dashboard";
import Profile_Main from "./components/Profile_Main";

function App() {
  return (
    <div className="container-fluid">
      <Navbar />
      <StockIndices />
      <div className="row">
        <div className="col-md-9">
          <Profile_Main />
        </div>
        <div className="col-md-3">
          <Watchlist />
        </div>
      </div>
    </div>
  );
}

export default App;

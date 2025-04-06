import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";

const StockIndices = () => {
  const [token] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );
  const decoded = jwtDecode(token);
  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="page-title-box d-inline-block d-md-flex justify-content-start justify-content-md-between align-items-center">
          <div className="my-3 my-md-0 ps-2">
            <div className="nifty-50 d-inline-block me-3">
              <div className="font-11 fw-semibold">Nifty 50</div>
              <div className="d-inline-block font-11">
                16,538.45 <span className="text-danger">-78.00</span>{" "}
                <span className="text-danger">(0.49%)</span>
              </div>
            </div>
            <div className="bse-sensex d-inline-block">
              <div className="font-11 fw-semibold">BSE Sensex</div>
              <div className="d-inline-block font-11">
                57,578.76 <span className="text-danger">-273.51</span>{" "}
                <span className="text-danger">(0.52%)</span>
              </div>
            </div>
          </div>
          {decoded.role === "admin" && (
            <div className="">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a className="nav-link" role="tab" aria-selected="true">
                    Explore
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" role="tab" aria-selected="false">
                    Investment
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" role="tab" aria-selected="false">
                    IPO
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockIndices;

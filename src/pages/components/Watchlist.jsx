import React, { useEffect } from "react";

const Watchlist = () => {
  useEffect(() => {
    const container = document.querySelector(
      ".tradingview-widget-container__widget1"
    );

    // Prevent duplicate script injection
    if (container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.onload = () => console.log("TradingView script loaded");
    script.onerror = (err) =>
      console.error("TradingView script failed to load", err);

    // Set data-config instead of innerHTML
    script.setAttribute(
      "data-config",
      JSON.stringify({
        colorTheme: "light",
        dateRange: "12M",
        showChart: true,
        locale: "en",
        width: "500",
        height: "550",
        tabs: [
          {
            title: "Indices",
            symbols: [{ s: "FOREXCOM:SPXUSD", d: "S&P 500 Index" }],
            originalTitle: "Indices",
          },
        ],
      })
    );

    container.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ zIndex: "-100" }}>
      <div className="tradingview-widget-container__widget1"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default Watchlist;

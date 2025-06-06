// components/BottomNav.tsx
import React from "react";
import "../styles/BottomNav.css";

type BottomNavProps = {
  currentTab: string;
  onTabChange: (tab: string) => void; // ✅ 引数 tab を受け取るようにする
};

// FontAwesome関連のインポート
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-button ${currentTab === "timeline" ? "active" : ""}`}
        onClick={() => onTabChange("timeline")}
      >
        TIME LINE
      </button>
      <button className="add-button">
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button
        className={`nav-button ${currentTab === "home" ? "active" : ""}`}
        onClick={() => onTabChange("home")}
      >
        HOME
      </button>
    </nav>
  );
};

export default BottomNav;

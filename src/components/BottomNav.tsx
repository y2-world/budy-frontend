// components/BottomNav.tsx
import React from "react";
import "../styles/BottomNav.css";

type BottomNavProps = {
  currentTab: string;
  onTabChange: () => void;
};

// FontAwesome関連のインポート
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <button className="nav-button">TIME LINE</button>
      <button className="add-button">
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button className="nav-button">HOME</button>
    </nav>
  );
};

export default BottomNav;
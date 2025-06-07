import React from "react";
import "../styles/Footer.css";
import { Link } from "react-router-dom";

type FooterProps = {
  currentTab: string;
  onTabChange: (tab: string) => void; // ✅ 引数 tab を受け取るようにする
};

// FontAwesome関連のインポート
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC<FooterProps> = ({ currentTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <div className="nav-side">
        <Link
          to="/timeline"
          className={`nav-button nav-link ${
            currentTab === "timeline" ? "active" : ""
          }`}
          onClick={() => onTabChange("timeline")}
        >
          TIME LINE
        </Link>
      </div>

      <button className="add-button">
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <div className="nav-side">
        <Link
          to="/mybudy"
          className={`nav-button nav-link ${
            currentTab === "home" ? "active" : ""
          }`}
          onClick={() => onTabChange("home")}
        >
          HOME
        </Link>
      </div>
    </nav>
  );
};

export default Footer;

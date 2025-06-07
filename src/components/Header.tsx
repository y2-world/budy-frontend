import React, { useEffect, useState } from "react";
import SideMenu from "./SideMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../styles/Header.css";
import { Link } from "react-router-dom";

type UserData = {
  name: string;
  weight: string | number;
  bodyFat: string | number;
};

const Header: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
        return;
      } catch (error) {
        console.error("ユーザーデータの解析に失敗しました:", error);
      }
    }

    const storedEmail = localStorage.getItem("loggedInUser");
    const storedUsers = localStorage.getItem("users");
    if (storedEmail && storedUsers) {
      try {
        const usersObj = JSON.parse(storedUsers);
        const user = usersObj[storedEmail];
        setUserData({
          name: user?.name || "ゲスト",
          weight: user?.weight ? `${user.weight}kg` : "",
          bodyFat: user?.bodyFat ? `${user.bodyFat}kg` : "",
        });
      } catch (error) {
        console.error("ユーザー一覧の解析に失敗しました:", error);
      }
    }
  }, []);
  return (
    <>
      <div className="header">
        <Link to="/mybudy" className="header-link">
          <img src="/images/logo.png" alt="Budy Logo" className="header-logo" />
        </Link>

        <div className="user-info">
          {userData
            ? `${userData.name}さん ${userData.weight} ${userData.bodyFat}`
            : ""}
        </div>
        <button
          className="menu-button"
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;

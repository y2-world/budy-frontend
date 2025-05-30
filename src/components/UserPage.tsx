import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPage.css";

function UserPage() {
  const [_loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [ userName, setUserName ] = useState<string>("ゲスト");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("loggedInUser");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (storedEmail && storedUsers[storedEmail]) {
      setLoggedInUser(storedEmail);
      setUserName(storedUsers[storedEmail].name);
    } else {
      setUserName("ゲスト");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("guestUser");
    setLoggedInUser(null);
    navigate("/"); // ログアウト後はトップページへリダイレクト
  };

  return (
    <div>
      <h1>{userName} さんのマイページ</h1>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}

export default UserPage;

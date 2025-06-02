import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingModal from "./OnboardingModal"; // OnboardingModalのインポート
import "./UserPage.css";
import "./Modal.css";
import "./Form.css";

function UserPage() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("ゲスト");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("loggedInUser");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");

    if (!storedEmail) {
      // ログインしていない場合はゲストユーザーとして扱う
      const guestEmail = "guest@example.com";
      let users = { ...storedUsers };

      if (!users[guestEmail]) {
        users[guestEmail] = { name: "ゲスト" };
        localStorage.setItem("users", JSON.stringify(users));
      }

      setLoggedInUser(guestEmail);
      setUserName(users[guestEmail].name || "ゲスト");

      const guestUser = users[guestEmail];
      if (!guestUser.onboarded) {
        setShowOnboarding(true); // オンボーディングモーダルを表示
      }
      return;
    }

    if (storedEmail && storedUsers[storedEmail]) {
      const user = storedUsers[storedEmail];
      setLoggedInUser(storedEmail);
      setUserName(user.name);

      if (!user.onboarded) {
        setShowOnboarding(true); // オンボーディングモーダルを表示
      }
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
    <div className="login-form">
      <div>ユーザー名: {userName}</div>
      {showOnboarding && loggedInUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <OnboardingModal
              userEmail={loggedInUser}
              onClose={() => setShowOnboarding(false)}
            />
          </div>
        </div>
      )}
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}

export default UserPage;

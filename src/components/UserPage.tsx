import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingModal from "./OnboardingModal"; // OnboardingModalのインポート
import "./UserPage.css";
import "./Modal.css";
import "./Form.css";

function UserPage() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("ゲスト");
  const [userBirthday, setUserBirthday] = useState<string>("");
  const [userHeight, setUserHeight] = useState<string>("");
  const [userIdealWeight, setUserIdealWeight] = useState<string>("");
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

      const guestUser = users[guestEmail];

      setLoggedInUser(guestEmail);
      localStorage.setItem("loggedInUser", guestEmail);
      setUserName(guestUser.name || "ゲスト");
      setUserBirthday(guestUser.birthday || "");
      setUserHeight(guestUser.height || "");
      setUserIdealWeight(guestUser.idealWeight || "");

      if (!guestUser.onboarded) {
        setShowOnboarding(true); // オンボーディングモーダルを表示
      }
      return;
    }

    if (storedEmail && storedUsers[storedEmail]) {
      const user = storedUsers[storedEmail] || {};
      setLoggedInUser(storedEmail);
      setUserName(user.name || "ゲスト");
      setUserBirthday(user.birthday || "");
      setUserHeight(user.height || "");
      setUserIdealWeight(user.idealWeight || "");

      if (!user.onboarded) {
        setShowOnboarding(true); // オンボーディングモーダルを表示
      }
    } else {
      setUserName("ゲスト");
      setUserBirthday("");
      setUserHeight("");
      setUserIdealWeight("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    navigate("/"); // ログアウト後はトップページへリダイレクト
  };

  const refreshUserData = () => {
    const storedEmail = localStorage.getItem("loggedInUser");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    if (storedEmail && storedUsers[storedEmail]) {
      const user = storedUsers[storedEmail];
      setUserName(user.name || "ゲスト");
      setUserBirthday(user.birthday || "");
      setUserHeight(user.height || "");
      setUserIdealWeight(user.idealWeight || "");
    }
  };

  return (
    <div className="login-form">
      <div>ユーザー名: {userName}</div>
      <div>生年月日: {userBirthday || "未設定"}</div>
      <div>身長: {userHeight || "未設定"}cm</div>
      <div>理想体重: {userIdealWeight || "未設定"}kg</div>
      {showOnboarding && loggedInUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <OnboardingModal
              userEmail={loggedInUser}
              onClose={() => {
                setShowOnboarding(false);
                refreshUserData();
              }} // ここでデータ更新Ï
            />
          </div>
        </div>
      )}
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
}

export default UserPage;

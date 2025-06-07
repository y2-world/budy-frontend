import Footer from "./Footer";
import { useState, useEffect } from "react";
import OnboardingModal from "./OnboardingModal"; // OnboardingModalのインポート
import "../styles/UserPage.css";
import "../styles/Modal.css";
import "../styles/Form.css";

function UserPage() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  // const [userName, setUserName] = useState<string>("ゲスト");
  const [userTargetWeight, setUserTargetWeight] = useState<string>("");
  const [showOnboarding, setShowOnboarding] = useState(false);

  // 日付をコンポーネントのトップレベルで定義
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // 月は0から始まるため+1
  const currentDay = date.getDate();

  // const navigate = useNavigate();

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
      // setUserName(guestUser.name || "ゲスト");
      setUserTargetWeight(guestUser.targetWeight || "");

      if (!guestUser.onboarded) {
        setShowOnboarding(true); // オンボーディングモーダルを表示
      }
      return;
    }

    if (storedEmail && storedUsers[storedEmail]) {
      const user = storedUsers[storedEmail] || {};
      setLoggedInUser(storedEmail);
      // setUserName(user.name || "ゲスト");
      setUserTargetWeight(user.targetWeight || "");

      if (!user.onboarded) {
        setShowOnboarding(true); // オンボーディングモーダルを表示
      }
    } else {
      // setUserName("ゲスト");
      setUserTargetWeight("");
    }
  }, []);

  const refreshUserData = () => {
    const storedEmail = localStorage.getItem("loggedInUser");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    if (storedEmail && storedUsers[storedEmail]) {
      const user = storedUsers[storedEmail];
      // setUserName(user.name || "ゲスト");
      setUserTargetWeight(user.targetWeight || "");
    }
  };

  return (
    <div className="user-page">
      <section className="user-stats">
        <div>
          {currentYear}年{currentMonth}月{currentDay}日
        </div>
        <div>目標体重 {userTargetWeight}kg</div>
      </section>
      <section className="user-graph"></section>
      <Footer currentTab="home" onTabChange={() => {}} />
      {showOnboarding && loggedInUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <OnboardingModal
              userEmail={loggedInUser}
              onClose={() => {
                setShowOnboarding(false);
                refreshUserData();
              }} // ここでデータ更新
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;

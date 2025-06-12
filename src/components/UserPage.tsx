import Footer from "./Footer";
import { useState, useEffect } from "react";
import OnboardingModal from "./OnboardingModal";
import UserChart from "./UserChart";
import "../styles/UserPage.css";
import "../styles/Modal.css";
import "../styles/Form.css";

function UserPage() {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [userTargetWeight, setUserTargetWeight] = useState<string>("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 日付をコンポーネントのトップレベルで定義
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; // 月は0から始まるため+1
  const currentDay = date.getDate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("loggedInUser");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    const storedRecords = JSON.parse(localStorage.getItem("records") || "{}");

    const defaultGuestUser = {
      name: "ゲスト",
      birthDate: "1990-01-01",
      height: "170",
      targetWeight: "60",
      onboarded: false,
    };

    if (!storedEmail) {
      const guestEmail = "guest@example.com";
      let users = { ...storedUsers };

      if (!users[guestEmail]) {
        users[guestEmail] = { ...defaultGuestUser };
        localStorage.setItem("users", JSON.stringify(users));
      }

      const guestUser = users[guestEmail];

      setLoggedInUser(guestEmail);
      localStorage.setItem("loggedInUser", guestEmail);
      setUserTargetWeight(guestUser.targetWeight || "");

      if (!guestUser.onboarded) {
        setShowOnboarding(true);
      }
      return;
    }

    if (storedUsers[storedEmail]) {
      const user = storedUsers[storedEmail];
      setLoggedInUser(storedEmail);
      setUserTargetWeight(user.targetWeight || "");

      // ✅ 最新の体重データを抽出
      const userRecords = storedRecords[storedEmail];
      if (userRecords) {
        const entries = Object.values(userRecords) as {
          weight?: string;
          timestamp?: string;
        }[];
        const weightEntries = entries
          .filter((entry) => entry.weight)
          .sort(
            (a, b) =>
              new Date(b.timestamp ?? "").getTime() -
              new Date(a.timestamp ?? "").getTime()
          );

        if (weightEntries.length > 0) {
          const latestWeight = parseFloat(weightEntries[0].weight ?? "0");
          setCurrentWeight(latestWeight);
        }
      }

      if (!user.onboarded) {
        setShowOnboarding(true);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval); // コンポーネントアンマウント時にクリーンアップ
  }, []);

  const refreshUserData = () => {
    const storedEmail = localStorage.getItem("loggedInUser");
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    if (storedEmail && storedUsers[storedEmail]) {
      const user = storedUsers[storedEmail];
      setUserTargetWeight(user.targetWeight || "");
    }
  };

  // storedUsersをコンポーネントスコープで取得
  const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");

  return (
    <div className="user-page">
      <div className="card-container">
        <div
          className="record-card"
          style={{
            position: "relative",
            color: "#333",
          }}
        >
          <div className="user-stats">
            <div>
              {currentYear}年{currentMonth}月{currentDay}日
              <div className="user-page-data">
                {" "}
                {currentTime.toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
            <div>
              目標体重 {userTargetWeight}kg
              {currentWeight !== null && userTargetWeight !== "" && (
                <div className="user-page-data">
                  (目標体重まで{" "}
                  {Math.max(
                    0,
                    parseFloat(
                      (currentWeight - parseFloat(userTargetWeight)).toFixed(1)
                    )
                  )}
                  kg)
                </div>
              )}
            </div>
          </div>
        </div>
        <section className="user-graph">
          <div className="record-card">
            {loggedInUser && <UserChart userEmail={loggedInUser} />}
          </div>
        </section>
      </div>
      <Footer onTabChange={() => {}} />
      {showOnboarding && loggedInUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <OnboardingModal
              userEmail={loggedInUser}
              birthDate={storedUsers[loggedInUser]?.birthDate ?? ""}
              height={storedUsers[loggedInUser]?.height ?? ""}
              targetWeight={storedUsers[loggedInUser]?.targetWeight ?? ""}
              onClose={() => {
                setShowOnboarding(false);
                refreshUserData();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;

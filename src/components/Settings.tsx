import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Card.css"; // ← カード用スタイルを適用

const Settings: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [birthdate, setBirthdate] = React.useState("");
  const [targetweight, setTargetweight] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    const currentEmail = localStorage.getItem("loggedInUser");
    const usersData = localStorage.getItem("users");
    console.log("currentEmail:", currentEmail);
    console.log("usersData:", usersData);

    if (currentEmail && usersData) {
      try {
        const users = JSON.parse(usersData);
        console.log("users object:", users);
        const user = users[currentEmail];
        console.log("user object:", user);
        if (user) {
          setUsername(user.name || "");
          setHeight(user.height || "");
          setBirthdate(user.birthday || "");
          setTargetweight(user.targetWeight || "");
        }
      } catch (error) {
        console.error("ユーザーデータ読み込み失敗:", error);
      }
    }
  }, []);

  const handleSave = () => {
    // 入力チェック（どれか一つでも空なら保存しない）
    if (!username || !birthdate || !height || !targetweight) {
      alert("すべての項目を入力してください");
      return;
    }

    const currentEmail = localStorage.getItem("loggedInUser");
    const usersData = localStorage.getItem("users");

    if (currentEmail && usersData) {
      try {
        const users = JSON.parse(usersData);
        users[currentEmail] = {
          ...users[currentEmail],
          name: username,
          height,
          birthday: birthdate,
          targetWeight: targetweight,
          onboarded: true,
        };
        localStorage.setItem("users", JSON.stringify(users));
      } catch (error) {
        console.error("ユーザーデータの保存に失敗しました:", error);
      }
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="user-page">
      <Header />
      <section className="user-title">
        <div>設定</div>
      </section>

      {showToast && <div className="toast">保存しました！</div>}

      <div className="card-container">
        <div className="record-card">
          <h3>ユーザー情報</h3>
          <label>
            ユーザー名
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
          </label>
          <br />
          <label>
            生年月日
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="input-field"
              required
            />
          </label>
          <br />
          <label>
            身長（cm）
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input-field"
              required
            />
          </label>
          <br />
          <label>
            理想体重 (kg)
            <input
              type="number"
              value={targetweight}
              onChange={(e) => setTargetweight(e.target.value)}
              className="input-field"
              required
            />
          </label>

          <br />
          <button
            className="submit-button"
            onClick={handleSave}
            disabled={!username || !birthdate || !height || !targetweight}
          >
            保存
          </button>
        </div>
      </div>

      <Footer currentTab="settings" onTabChange={() => {}} />
    </div>
  );
};

export default Settings;

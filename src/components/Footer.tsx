import React, { useState } from "react";
import "../styles/Footer.css";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

type FooterProps = {
  onTabChange: (tab: string) => void;
};

const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"weight" | "diary">("weight");
  const [weight, setWeight] = useState<number | "">("");
  const [bodyFat, setBodyFat] = useState<number | "">("");
  const [diary, setDiary] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  const userId = localStorage.getItem("loggedInUser");
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  const saveRecord = () => {
    if (!userId) {
      alert("ユーザー情報が見つかりません。再度ログインしてください。");
      return;
    }

    const stored = localStorage.getItem("records");
    let allUsersRecords;
    try {
      allUsersRecords = stored ? JSON.parse(stored) : {};
      if (!allUsersRecords || Array.isArray(allUsersRecords)) {
        allUsersRecords = {};
      }
    } catch {
      allUsersRecords = {};
    }

    if (!allUsersRecords[userId]) {
      allUsersRecords[userId] = {};
    }

    const now = new Date();
    const timestamp = now.toISOString();

    if (activeTab === "weight") {
      allUsersRecords[userId][timestamp] = {
        date: selectedDate,
        weight: Number(weight),
        bodyFat: bodyFat !== "" ? Number(bodyFat) : null,
        timestamp,
        userId,
      };
    } else {
      allUsersRecords[userId][timestamp] = {
        date: selectedDate,
        diary: diary.trim(),
        timestamp,
        userId,
      };
    }

    localStorage.setItem("records", JSON.stringify(allUsersRecords));

    // タイムスタンプを変更してstorageイベント通知（他タブ用）
    localStorage.setItem("recordsUpdated", Date.now().toString());

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // navigateでstateを渡し、リスト側で更新をトリガー
    navigate(activeTab === "weight" ? "/weight" : "/diary", {
      state: {
        refresh: true,
        message: "登録が完了しました！",
      },
    });
  };

  const handleSubmit = () => {
    if (activeTab === "weight") {
      if (weight === "" || weight <= 0) {
        alert("体重を正しく入力してください");
        return;
      }
      if (bodyFat !== "" && bodyFat < 0) {
        alert("体脂肪率を正しく入力してください");
        return;
      }
    } else {
      if (!diary.trim()) {
        alert("日記を入力してください。");
        return;
      }
    }

    saveRecord();
    setIsModalOpen(false);
    setWeight("");
    setBodyFat("");
    setDiary("");
  };

  const isSubmitDisabled = () => {
    if (activeTab === "weight") {
      if (weight === "" || weight <= 0) return true;
      if (bodyFat !== "" && bodyFat < 0) return true;
      return false;
    } else {
      return diary.trim() === "";
    }
  };

  return (
    <>
      <nav className="bottom-nav">
        <div className="nav-side">
          <Link
            to="/mybudy"
            className="nav-button nav-link"
            onClick={() => onTabChange("home")}
          >
            HOME
          </Link>
        </div>

        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>

        <div className="nav-side">
          <Link
            to="/timeline"
            className="nav-button nav-link"
            onClick={() => onTabChange("timeline")}
          >
            TIME LINE
          </Link>
        </div>
      </nav>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} className="record-modal">
          <div className="record-tabs">
            <button
              className={activeTab === "weight" ? "active" : ""}
              onClick={() => setActiveTab("weight")}
            >
              体重・体脂肪率
            </button>
            <button
              className={activeTab === "diary" ? "active" : ""}
              onClick={() => setActiveTab("diary")}
            >
              Budy日記
            </button>
          </div>

          <div className="record-content">
            <div className="record-date">
              <label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>
            </div>

            {activeTab === "weight" ? (
              <>
                <label>
                  体重 (kg)
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) =>
                      setWeight(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    min="0"
                    step="0.1"
                  />
                </label>
                <label>
                  体脂肪率 (%)
                  <input
                    type="number"
                    value={bodyFat}
                    onChange={(e) =>
                      setBodyFat(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    min="0"
                    step="0.1"
                  />
                </label>
              </>
            ) : (
              <label>
                <textarea
                  value={diary}
                  onChange={(e) => setDiary(e.target.value)}
                  rows={7}
                  maxLength={300}
                />
                <p>{diary.length}/300</p>
              </label>
            )}

            <button
              className={`submit-button${
                isSubmitDisabled() ? " disabled" : ""
              }`}
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
            >
              登録
            </button>
          </div>
        </Modal>
      )}

      {showToast && <div className="toast">登録が完了しました！</div>}
    </>
  );
};

export default Footer;

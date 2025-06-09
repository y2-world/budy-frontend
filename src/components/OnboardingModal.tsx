import { useEffect, useState } from "react";
import "../styles/Modal.css";
import "../styles/TutorialContent.css";
import "../styles/Form.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type OnboardingModalProps = {
  userEmail: string;
  onClose: () => void;
};

function OnboardingModal({ userEmail, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState("");
  const [birthday, setBirthday] = useState("");
  const [weight, setTargetWeight] = useState("");
  const [name, setName] = useState<string>("");
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const validateHeight = (value: string): string => {
    if (!/^\d+$/.test(value)) return "数値で入力してください。";
    const num = parseInt(value, 10);
    if (num < 100 || num > 250)
      return "身長は100cm〜250cmの範囲で入力してください。";
    return "";
  };

  const validateWeight = (value: string): string => {
    if (!/^\d+$/.test(value)) return "数値で入力してください。";
    const num = parseInt(value, 10);
    if (num < 30 || num > 200)
      return "目標体重は30kg〜200kgの範囲で入力してください。";
    return "";
  };

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[userEmail]) {
      setName(users[userEmail].name);
    }
  }, [userEmail]);

  const handleSubmit = () => {
    const heightValidation = validateHeight(height);
    const weightValidation = validateWeight(weight);
    setHeightError(heightValidation);
    setWeightError(weightValidation);

    if (!height || !birthday || heightValidation || weightValidation) {
      alert("すべての項目を正しく入力してください。");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!users[userEmail]) {
      users[userEmail] = {};
    }
    users[userEmail].height = height;
    users[userEmail].birthday = birthday;
    users[userEmail].targetWeight = weight;
    localStorage.setItem("users", JSON.stringify(users));

    nextStep();
  };

  const handleFinish = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!users[userEmail]) {
      users[userEmail] = {};
    }
    users[userEmail].onboarded = true;
    localStorage.setItem("users", JSON.stringify(users));
    onClose(); // モーダルを閉じる
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="step-indicator">STEP {step} / 3</div>
        {step === 1 && (
          <div className="tutorial-slide">
            <p>{name ? `${name}さん` : ""}</p>
            <h2>Budyへようこそ！</h2>
            <p>あなたのBuddyとなって健康管理をサポートします。</p>
            <span onClick={nextStep}>
              <FontAwesomeIcon icon={faArrowRight} style={{ color: "black" }} />
            </span>
          </div>
        )}
        {step === 2 && (
          <div className="tutorial-slide">
            <div className="form">
              <h2>基本情報入力</h2>
              <p>基本情報を入力して、あなたの健康管理を始めましょう。</p>
              <label>生年月日</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
              <label>身長 (cm)</label>
              <input
                type="text"
                value={height}
                onChange={(e) => {
                  const value = e.target.value;
                  setHeight(value);
                  setHeightError(validateHeight(value));
                }}
                placeholder="例：160"
              />
              {heightError && (
                <div className="error-message">{heightError}</div>
              )}

              <label>目標体重 (kg)</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => {
                  const value = e.target.value;
                  setTargetWeight(value);
                  setWeightError(validateWeight(value));
                }}
                placeholder="例：50"
              />
              {weightError && (
                <div className="error-message">{weightError}</div>
              )}
              <div className="form-buttons">
                <span onClick={prevStep}>
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ color: "black" }}
                  />
                </span>

                <button
                  className="icon-button"
                  onClick={handleSubmit}
                  disabled={
                    !birthday ||
                    !height ||
                    !weight ||
                    !!heightError ||
                    !!weightError
                  }
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="tutorial-slide">
            <h2>準備完了！</h2>
            <p>さあ、始めましょう！</p>
            <button className="form-start" onClick={handleFinish}>
              はじめる
            </button>
            <br></br>
            <br></br>
            <span onClick={prevStep}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: "black" }} />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardingModal;

import { useEffect, useState } from "react";
import "../styles/Modal.css";
import "../styles/TutorialContent.css";
import "../styles/Form.css";
import { validateHeight, validateWeight } from "../utils/validators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type OnboardingModalProps = {
  userEmail: string;
  height?: string;
  targetWeight?: string;
  birthDate?: string;
  onClose: () => void;
};

function OnboardingModal({
  userEmail,
  height: initialHeight,
  targetWeight: initialWeight,
  birthDate: initialBirthDate,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState<string>(initialHeight ?? "");
  const [birthday, setBirthday] = useState<string>(initialBirthDate ?? "");
  const [weight, setTargetWeight] = useState<string>(initialWeight ?? "");
  const [name, setName] = useState<string>("");
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

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
                placeholder="例：170"
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
                placeholder="例：60"
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

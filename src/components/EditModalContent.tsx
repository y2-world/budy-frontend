import React, { useState, useEffect } from "react";
import "../styles/Modal.css";

type Props = {
  record: {
    timestamp: string;
    diary?: string;
    weight?: string;
    bodyFat?: string;
  };
  onSave: (updatedData: {
    diary?: string;
    weight?: string;
    bodyFat?: string;
  }) => void;
  onClose: () => void;
};

const EditModalContent: React.FC<Props> = ({ record, onSave, onClose }) => {
  const [diaryText, setDiaryText] = useState(record.diary || "");
  const [weight, setWeight] = useState(record.weight || "");
  const [bodyFat, setBodyFat] = useState(record.bodyFat || "");

  useEffect(() => {
    setDiaryText(record.diary || "");
    setWeight(record.weight || "");
    setBodyFat(record.bodyFat || "");
  }, [record]);

const handleSave = () => {
  const updated: { diary?: string; weight?: string; bodyFat?: string } = {};

  if (isDiary) {
    updated.diary = diaryText;
  }
  if (isWeight) {
    updated.weight = weight;
    updated.bodyFat = bodyFat;
  }

  onSave(updated); // ← 変更された部分だけ渡す
  onClose();
};

  const isDiary = "diary" in record;
  const isWeight = "weight" in record || "bodyFat" in record;

  return (
    <div className="record-content">
      {isDiary && (
        <>
          <div className="edit-diary">日記を編集</div>
          <textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            rows={7}
            style={{ width: "100%", padding: "8px" }}
          />
        </>
      )}

      {isWeight && (
        <>
          <div className="edit-diary">体重・体脂肪率を編集</div>
          <label>
            体重 (kg)
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
            />
          </label>
          <label>
            体脂肪率 (%)
            <input
              type="number"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </>
      )}

      <button
        className="submit-button"
        onClick={handleSave}
        disabled={
          diaryText.trim() === "" &&
          (weight.trim() === "" || bodyFat.trim() === "")
        }
      >
        更新
      </button>
    </div>
  );
};

export default EditModalContent;
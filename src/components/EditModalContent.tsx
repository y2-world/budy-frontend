import React, { useState, useEffect } from "react";
import "../styles/Modal.css";
import "../styles/Card.css";

type Props = {
  record: {
    timestamp: string;
    date: string;
    diary?: string;
    weight?: string;
    bodyFat?: string;
  };
  onSave: (updatedData: {
    date?: string;
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
  const [date, setDate] = useState(() => {
    const initialDate = record.date ?? "";
    return initialDate.slice(0, 10);
  });

  // ここで定義を移動
  const isDiary = "diary" in record;
  const isWeight = !!record.weight || !!record.bodyFat;

  useEffect(() => {
    setDiaryText(record.diary || "");
    setWeight(record.weight || "");
    setBodyFat(record.bodyFat || "");
    setDate(record.date);
  }, [record]);

  const handleSave = () => {
    const updated: {
      date?: string;
      diary?: string;
      weight?: string;
      bodyFat?: string;
    } = {};

    const originalDate = record.date.slice(0, 10);
    if (date !== originalDate) {
      updated.date = date;
    }

    if (isDiary) {
      updated.diary = diaryText;
    }
    if (isWeight) {
      updated.weight = weight;
      updated.bodyFat = bodyFat;
    }

    onSave(updated);
    onClose();
  };

  return (
    <div className="record-content">
      {isDiary && <div className="edit-diary">日記を編集</div>}
      {isWeight && <div className="edit-diary">体重・体脂肪率を編集</div>}
      <label>
        日付
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
        />
      </label>
      {isDiary && (
        <>
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
          (isDiary && diaryText.trim() === "") ||
          (isWeight && (weight.trim() === "" || bodyFat.trim() === ""))
        }
      >
        更新
      </button>
    </div>
  );
};

export default EditModalContent;

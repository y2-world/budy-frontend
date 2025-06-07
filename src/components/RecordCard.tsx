import React, { useState, useEffect } from "react";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  date: string;
  weight?: number;
  bodyFat?: number | null;
  diary?: string;
  timestamp?: string;
  height?: number | null;
  onEdit?: () => void;
  onDelete?: () => void;
};

const RecordCard: React.FC<Props> = ({
  date,
  weight,
  bodyFat,
  diary,
  timestamp,
  onEdit,
  onDelete,
}) => {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const fetchHeight = () => {
      const storedEmail = localStorage.getItem("loggedInUser");
      const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
      const user =
        storedEmail && storedUsers[storedEmail]
          ? storedUsers[storedEmail]
          : null;
      const h = user && user.height ? parseFloat(user.height) / 100 : null;
      setHeight(h);
    };

    fetchHeight();

    // storageイベントリスナーを追加（他タブでlocalStorage更新された場合も反映）
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === "users" || event.key === "loggedInUser") {
        fetchHeight();
      }
    };
    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  // heightはuseStateの値を使う
  const bmi = React.useMemo(() => {
    if (weight !== undefined && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return null;
  }, [weight, height]); // 依存配列に weight と height があるので編集後に再計算される

  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <div
      className="record-card"
      style={{ position: "relative", paddingRight: "40px" }}
    >
      <h3>{formattedTime}</h3>
      {weight !== undefined && <p>体重: {weight} kg</p>}
      {bodyFat !== null && bodyFat !== undefined && (
        <p>体脂肪率: {bodyFat.toFixed(1)}%</p>
      )}
      {bmi && <p>BMI: {bmi}</p>}
      {diary && <p>{diary}</p>}

      <div
        className="post-actions"
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          gap: "10px",
        }}
      >
        <FontAwesomeIcon
          icon={faPenToSquare}
          title="編集"
          style={{ color: "#3498db", cursor: "pointer" }}
          onClick={onEdit}
        />
        <FontAwesomeIcon
          icon={faTrash}
          title="削除"
          style={{ color: "#e74c3c", cursor: "pointer" }}
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default RecordCard;

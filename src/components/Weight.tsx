import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import RecordCard from "./RecordCard";
import Modal from "./Modal";
import EditModalContent from "./EditModalContent";
import { getLoggedInUserHeight } from "../services/userService"; 
import {
  getWeightRecords,
  deleteWeightRecord,
  updateWeightRecord,
} from "../services/postService";

const Weight: React.FC = () => {
  const currentUserId = localStorage.getItem("loggedInUser") ?? "";
  const [records, setRecords] = useState(() => getWeightRecords(currentUserId));

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const visibleCount = useInfiniteScroll(records.length);

  const height = getLoggedInUserHeight();

 useEffect(() => {
  const onRecordsUpdated = () => {
    setRecords(getWeightRecords(currentUserId));
  };
  window.addEventListener("recordsUpdated", onRecordsUpdated);
  return () => window.removeEventListener("recordsUpdated", onRecordsUpdated);
}, []);

  const [editingRecord, setEditingRecord] = useState<{
    timestamp: string;
    weight?: string;
    bodyFat?: string;
  } | null>(null);

  const deleteRecord = (timestamp: string) => {
    if (!window.confirm("本当にこの記録を削除しますか？")) return;
    const success = deleteWeightRecord(currentUserId, timestamp);
    if (success) {
      setRecords(getWeightRecords(currentUserId));
      setToastMessage("削除しました！");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const editRecord = (timestamp: string) => {
    const record = records.find((r) => r.timestamp === timestamp);
    if (record) {
      setEditingRecord({
        timestamp,
        weight: record.weight?.toString() ?? "",
        bodyFat: record.bodyFat?.toString() ?? "",
      });
    }
  };

  const handleSaveEdit = (updated: { weight?: string; bodyFat?: string }) => {
    if (!editingRecord) return;

    const parsedWeight = updated.weight ? Number(updated.weight) : undefined;
    const parsedBodyFat = updated.bodyFat ? Number(updated.bodyFat) : undefined;

    updateWeightRecord(currentUserId, editingRecord.timestamp, {
      weight: parsedWeight,
      bodyFat: parsedBodyFat,
    });

    setRecords(getWeightRecords(currentUserId));
    setEditingRecord(null);
    setToastMessage("更新しました！");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleTabChange = (tab: string) => {
    console.log("Tab changed to:", tab);
  };

  return (
    <div className="user-page">
      <Header />
      <section className="user-title">
        <div>体重管理</div>
      </section>

      {showToast && <div className="toast">{toastMessage}</div>}

      {records.length === 0 ? (
        <p>体重記録がありません。</p>
      ) : (
        <div className="card-container">
          {records.slice(0, visibleCount).map((record) => (
            <RecordCard
              key={record.timestamp}
              {...record}
              onEdit={() => editRecord(record.timestamp)}
              onDelete={() => deleteRecord(record.timestamp)}
              height={height} // ← BMI 計算用に渡す
            />
          ))}
        </div>
      )}

      <Footer onTabChange={handleTabChange} />

      {editingRecord && (
        <Modal onClose={() => setEditingRecord(null)}>
          <EditModalContent
            record={editingRecord}
            onSave={handleSaveEdit}
            onClose={() => setEditingRecord(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Weight;

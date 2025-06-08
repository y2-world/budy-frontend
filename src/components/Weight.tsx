import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { loadRecordsFromLocalStorage } from "../utils/recordUtils";
import RecordCard from "./RecordCard";
import Modal from "./Modal";
import EditModalContent from "./EditModalContent";

const currentUserId = localStorage.getItem("loggedInUser") ?? "";
console.log("currentUserId:", currentUserId);

const Weight: React.FC = () => {
  const loadWeightRecords = () =>
    loadRecordsFromLocalStorage("records", (data) => {
      return (
        data.userId === currentUserId &&
        typeof data.weight === "number" &&
        typeof data.bodyFat === "number"
      );
    });

  const [records, setRecords] = useState(loadWeightRecords);
  const [showToast, setShowToast] = useState(false);
  const visibleCount = useInfiniteScroll(records.length);

  // 身長を1度だけ取得してstateに保持
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
    const currentUser = storedUsers[currentUserId];
    if (currentUser && currentUser.height) {
      const parsedHeight = parseFloat(currentUser.height);
      if (!isNaN(parsedHeight)) {
        setHeight(parsedHeight / 100); // cm → m に変換
      }
    }
  }, []);

  useEffect(() => {
    const onRecordsUpdated = () => {
      const updated = loadWeightRecords();
      setRecords(updated);
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

    const storedRaw = localStorage.getItem("records") || "{}";
    const allRecords = JSON.parse(storedRaw);
    if (!allRecords[currentUserId]) return;

    delete allRecords[currentUserId][timestamp];
    localStorage.setItem("records", JSON.stringify(allRecords));
    setRecords(loadWeightRecords());
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

    const storedRaw = localStorage.getItem("records") || "{}";
    const allRecords = JSON.parse(storedRaw);
    if (!allRecords[currentUserId]) return;

    const recordToUpdate = allRecords[currentUserId][editingRecord.timestamp];
    if (!recordToUpdate) return;

    const parsedWeight =
      updated.weight !== undefined && updated.weight !== ""
        ? Number(updated.weight)
        : recordToUpdate.weight;

    const parsedBodyFat =
      updated.bodyFat !== undefined && updated.bodyFat !== ""
        ? Number(updated.bodyFat)
        : recordToUpdate.bodyFat;

    allRecords[currentUserId][editingRecord.timestamp] = {
      ...recordToUpdate,
      weight: parsedWeight,
      bodyFat: parsedBodyFat,
    };

    localStorage.setItem("records", JSON.stringify(allRecords));
    setRecords(loadWeightRecords());
    setEditingRecord(null);
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

      {showToast && <div className="toast">登録しました！</div>}

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
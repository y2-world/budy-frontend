import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import RecordCard from "./RecordCard";
import Modal from "./Modal";
import EditModalContent from "./EditModalContent";
import { getLoggedInUserHeight } from "../services/userService";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  // 画面を更新してトースト表示する共通関数
  const refreshRecordsAndShowToast = (message = "登録が完了しました！") => {
    const records = getWeightRecords(currentUserId);
    setRecords(records);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // storage イベントで他タブからの更新を検知
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "recordsUpdated") {
        refreshRecordsAndShowToast();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currentUserId]);

  // location.state.refresh が true なら更新＆トースト表示
  useEffect(() => {
    if (location.state?.refresh) {
      const message = location.state.message ?? "更新しました";
      refreshRecordsAndShowToast(message);
      window.history.replaceState({}, document.title); // stateクリア
    }
  }, [location.key]);

  const [editingRecord, setEditingRecord] = useState<{
    timestamp: string;
    weight?: string;
    bodyFat?: string;
  } | null>(null);

  const deleteRecord = (timestamp: string) => {
    if (!window.confirm("本当にこの記録を削除しますか？")) return;
    const success = deleteWeightRecord(currentUserId, timestamp);
    if (success) {
      refreshRecordsAndShowToast("削除しました！");
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

    refreshRecordsAndShowToast("更新しました！");
    setEditingRecord(null);
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
          {records
            .filter((record) => record.weight !== undefined)
            .slice(0, visibleCount)
            .map((record) => (
              <RecordCard
                key={record.timestamp}
                {...record}
                onEdit={() => editRecord(record.timestamp)}
                onDelete={() => deleteRecord(record.timestamp)}
                height={height}
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

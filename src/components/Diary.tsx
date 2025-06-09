import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import RecordCard from "./RecordCard";
import Modal from "./Modal";
import EditModalContent from "./EditModalContent";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useLocation } from "react-router-dom";
import {
  getDiaryRecords,
  deleteDiaryRecord,
  updateDiaryRecord,
} from "../services/postService";

const Diary: React.FC = () => {
  const currentUserId = localStorage.getItem("loggedInUser") ?? "";
  const [records, setRecords] = useState(() => getDiaryRecords(currentUserId));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const visibleCount = useInfiniteScroll(records.length);
  const location = useLocation();

  // 画面を更新してトースト表示する共通関数
  const refreshRecordsAndShowToast = (message = "登録が完了しました！") => {
    const records = getDiaryRecords(currentUserId);
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

  // 編集対象のレコード
  const [editingRecord, setEditingRecord] = useState<{
    timestamp: string;
    date?: string;
  } | null>(null);

  // 削除処理
  const deleteRecord = (timestamp: string) => {
    if (!window.confirm("本当にこの日記を削除しますか？")) return;
    const success = deleteDiaryRecord(currentUserId, timestamp);
    if (success) {
      refreshRecordsAndShowToast("削除しました！");
    }
  };

  // 編集開始
  const editRecord = (timestamp: string) => {
    const record = records.find((r) => r.timestamp === timestamp);
    if (record) {
      setEditingRecord({
        timestamp,
        diary: record.diary ?? "",
        date: record.date ?? record.timestamp,
      });
    }
  };

  // 編集内容保存
  const handleSaveEdit = (updatedData: { diary?: string; date?: string }) => {
    if (!editingRecord) return;

    const updatedDiary = (updatedData.diary ?? "").trim();
    if (!updatedDiary) {
      alert("日記の内容は空白にできません。");
      return;
    }

    updateDiaryRecord(currentUserId, editingRecord.timestamp, {
      diary: updatedDiary,
      date: updatedData.date, // ← ここを追加
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
        <div>Budy日記</div>
      </section>

      {showToast && <div className="toast">{toastMessage}</div>}

      {records.length === 0 ? (
        <p>日記の記録がありません。</p>
      ) : (
        <div className="card-container">
          {records.slice(0, visibleCount).map((record) => (
            <RecordCard
              key={record.timestamp}
              {...record}
              onEdit={() => editRecord(record.timestamp)}
              onDelete={() => deleteRecord(record.timestamp)}
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

export default Diary;

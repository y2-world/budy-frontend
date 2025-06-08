import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import RecordCard from "./RecordCard";
import Modal from "./Modal";
import EditModalContent from "./EditModalContent";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
  getDiaryRecords,
  deleteDiaryRecord,
  updateDiaryRecord,
} from "../services/postService";

const currentUserId = localStorage.getItem("loggedInUser") ?? "";

const Diary: React.FC = () => {
  const [records, setRecords] = useState(() => getDiaryRecords(currentUserId));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const visibleCount = useInfiniteScroll(records.length);

  // localStorage更新を監視してリアルタイム更新（Footerのイベントと連携）
  useEffect(() => {
    const onRecordsUpdated = () => {
      setRecords(getDiaryRecords(currentUserId));
    };
    window.addEventListener("recordsUpdated", onRecordsUpdated);
    return () => window.removeEventListener("recordsUpdated", onRecordsUpdated);
  }, []);

  // 編集対象のレコード
  const [editingRecord, setEditingRecord] = useState<{
    timestamp: string;
    diary: string;
  } | null>(null);

  // 削除処理
  const deleteRecord = (timestamp: string) => {
    if (!window.confirm("本当にこの日記を削除しますか？")) return;
    const success = deleteDiaryRecord(currentUserId, timestamp);
    if(success) {
      setRecords(getDiaryRecords(currentUserId));
       setToastMessage("削除しました！");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    }
  };

  // 編集開始
     const editRecord = (timestamp: string) => {
    const record = records.find((r) => r.timestamp === timestamp);
    if (record) {
      setEditingRecord({ timestamp, diary: record.diary ?? "" });
    }
  };

  // 編集内容保存
  const handleSaveEdit = (updatedData: { diary?: string }) => {
    if (!editingRecord) return;

    const updatedDiary = updatedData.diary ?? "";
    if (updatedDiary.trim() === "") {
      alert("日記の内容は空白にできません。");
      return;
    }

    updateDiaryRecord(currentUserId, editingRecord.timestamp, {diary: updatedDiary});

    setRecords(getDiaryRecords(currentUserId));
    setEditingRecord(null);
    setToastMessage("更新しました！");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Footer用タブ切替（必要なら）
  const handleTabChange = (tab: string) => {
    // 現状空実装。必要ならページ遷移等を追加
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

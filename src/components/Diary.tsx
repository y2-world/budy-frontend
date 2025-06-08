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

const Diary: React.FC = () => {
  // ロード関数の中でフィルターを明示的にする
  const loadDiaryRecords = () =>
    loadRecordsFromLocalStorage("records", (data) => {
      return (
        data.userId === currentUserId &&
        typeof data.diary === "string" &&
        data.diary.trim() !== ""
      );
    });

  const [records, setRecords] = useState(loadDiaryRecords);

  // トースト表示制御（カスタムフックが無ければ簡単に）
  const [showToast, setShowToast] = useState(false);

  const visibleCount = useInfiniteScroll(records.length);

  // localStorage更新を監視してリアルタイム更新（Footerのイベントと連携）
  useEffect(() => {
    const onRecordsUpdated = () => {
      const updated = loadDiaryRecords();
      setRecords(updated);
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

    const storedRaw = localStorage.getItem("records") || "{}";
    const allRecords = JSON.parse(storedRaw);

    if (!allRecords[currentUserId]) return;

    delete allRecords[currentUserId][timestamp];
    localStorage.setItem("records", JSON.stringify(allRecords));

    // 削除後にstate更新
    setRecords(loadDiaryRecords());
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

    // 以降は今まで通り
    const storedRaw = localStorage.getItem("records") || "{}";
    const allRecords = JSON.parse(storedRaw);

    if (!allRecords[currentUserId]) return;

    const recordToUpdate = allRecords[currentUserId][editingRecord.timestamp];
    if (!recordToUpdate) return;

    allRecords[currentUserId][editingRecord.timestamp] = {
      ...recordToUpdate,
      diary: updatedDiary,
    };

    localStorage.setItem("records", JSON.stringify(allRecords));

    setRecords(loadDiaryRecords());
    setEditingRecord(null);
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

      {showToast && <div className="toast">登録しました！</div>}

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

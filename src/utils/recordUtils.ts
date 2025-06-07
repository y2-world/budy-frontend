export type RecordData = {
  date: string;
  weight?: number;
  bodyFat?: number | null;
  diary?: string;
  timestamp: string;  // ここを追加（必須or任意はデータ次第で）
  userId?: string;    // userIdもあったほうが安全
};

export const loadRecordsFromLocalStorage = (
  key: string,
  filterFn?: (data: any) => boolean
): RecordData[] => {
  const stored = localStorage.getItem(key);
  if (!stored) return [];

  const parsed: { [userId: string]: { [timestamp: string]: any } } = JSON.parse(stored);
  const allRecords: RecordData[] = [];

  Object.values(parsed).forEach((userRecords) => {
    Object.entries(userRecords).forEach(([timestamp, data]) => {
      const record = { ...data, timestamp };
      if (!filterFn || filterFn(record)) {
        allRecords.push(record);
      }
    });
  });

  return allRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
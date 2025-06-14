export type Post = {
    id: string;
    date: string;
    diary?: string;
    timestamp: string;
    email: string;
    likeCount?: number;
}

export type User = {
    name?: string;
}

export const getAllPosts = (): { posts: Post[]; users:{[email:string]: User }} => {
    const allRecordsRaw = localStorage.getItem("records");
    const usersRaw = localStorage.getItem("users");

    if(!allRecordsRaw || !usersRaw) return { posts: [], users: {} };
    
    const allRecords = JSON.parse(allRecordsRaw);
    const users = JSON.parse(usersRaw);

    const allPosts: Post[] = [];

    for (const [email, postsByUser] of Object.entries(allRecords)) {
        for (const [timestamp, post] of Object.entries(postsByUser as any)) {
            if((post as Post).diary) {
                allPosts.push({
                    ...(post as Post),
                    timestamp,
                    email,
                    id: email + timestamp,
                    likeCount: (post as any).likeCount || 0,
                    date: (post as any).date || new Date(timestamp).toISOString().slice(0, 10), // ← 追加・補完
                });
            }
        }
    }

    allPosts.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { posts: allPosts, users };
};

export const getLikedPosts = (): { [key: string]: boolean } => {
    const likedRaw = localStorage.getItem("likedPosts");
    return likedRaw ? JSON.parse(likedRaw) : {};
};

export const toggleLikeLocal = (post: Post, liked: boolean): void => {
    const key = post.id;
    const likedPosts = getLikedPosts();
    likedPosts[key] = liked;
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    //recordsも更新
    const recordsRaw = localStorage.getItem("records");
    if(!recordsRaw) return;
    const records = JSON.parse(recordsRaw);

    if(records[post.email] && records[post.email][post.timestamp]) {
        records[post.email][post.timestamp].likeCount = liked
        ? (post.likeCount || 0) + 1
        : Math.max((post.likeCount || 1) -1, 0);

        localStorage.setItem("records", JSON.stringify(records));
    }
}

import type { WeightRecord } from "../types/record";

export const getWeightRecords = (userId: string): WeightRecord[] => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  const userRecords = allRecords[userId] || {};

  return Object.entries(userRecords)
  .map(([timestamp, data]: any) => ({
    timestamp,
    date: data.date,
    weight: data.weight,
    bodyFat: data.bodyFat,
    userId,
  }))
  .sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return b.timestamp.localeCompare(a.timestamp);
  });
};

export const deleteWeightRecord = (userId: string, timestamp: string): boolean => {
    const raw = localStorage.getItem("records") || "{}";
    const allRecords = JSON.parse(raw);
    if(!allRecords[userId] || !allRecords[userId][timestamp]) return false;
    delete allRecords[userId][timestamp];
    localStorage.setItem("records", JSON.stringify(allRecords));
    return true;
};

export const updateWeightRecord = (
  userId: string,
  timestamp: string,
  updated: { weight?: number; bodyFat?: number; date?: string }
): boolean => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  if (!allRecords[userId] || !allRecords[userId][timestamp]) return false;

  const current = allRecords[userId][timestamp];

  allRecords[userId][timestamp] = {
    ...current,
    ...updated,
    date: updated.date ?? current.date ?? timestamp.slice(0, 10), // ← ここがポイント
  };

  localStorage.setItem("records", JSON.stringify(allRecords));
  return true;
};

import type { DiaryRecord } from "../types/record";

export const getDiaryRecords = (userId: string): DiaryRecord[] => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  const userRecords = allRecords[userId] || {};

  return (Object.values(userRecords) as DiaryRecord[])
  .filter(
    (record) => typeof record.diary === "string" && record.diary.trim() !== ""
  )
  .sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return b.timestamp.localeCompare(a.timestamp);
  });
};

export const deleteDiaryRecord = (userId: string, timestamp: string): boolean => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  if (!allRecords[userId] || !allRecords[userId][timestamp]) return false;

  delete allRecords[userId][timestamp];
  localStorage.setItem("records", JSON.stringify(allRecords));
  return true;
};

export const updateDiaryRecord = (
  userId: string,
  timestamp: string,
  updates: { diary?: string, date?: string },
): boolean => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  if (!allRecords[userId] || !allRecords[userId][timestamp]) return false;

  const current = allRecords[userId][timestamp];

  allRecords[userId][timestamp] = {
    ...current,
    ...updates,
    date: updates.date || current.date || timestamp.slice(0, 10), // ← 安全に補完
  };

  localStorage.setItem("records", JSON.stringify(allRecords));
  return true;
};
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
    return Object.entries(userRecords).map(([timestamp, data]: any) => ({
        timestamp,
        weight: data.weight,
        bodyFat: data.bodyFat,
        userId,
    }));
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
  updated: { weight?: number; bodyFat?: number }
): boolean => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  if (!allRecords[userId] || !allRecords[userId][timestamp]) return false;

  const current = allRecords[userId][timestamp];
  allRecords[userId][timestamp] = {
    ...current,
    ...updated,
  };

  localStorage.setItem("records", JSON.stringify(allRecords));
  return true;
};

// 既存の records オブジェクトは { [userId]: { [timestamp]: record } }

export const getDiaryRecords = (userId: string) => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  const userRecords = allRecords[userId] || {};
  return Object.values(userRecords).filter(
    (record: any) => typeof record.diary === "string" && record.diary.trim() !== ""
  );
};

export const deleteDiaryRecord = (userId: string, timestamp: string) => {
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
  updates: { diary?: string }
) => {
  const raw = localStorage.getItem("records") || "{}";
  const allRecords = JSON.parse(raw);
  if (!allRecords[userId] || !allRecords[userId][timestamp]) return false;

  allRecords[userId][timestamp] = {
    ...allRecords[userId][timestamp],
    ...updates,
  };
  localStorage.setItem("records", JSON.stringify(allRecords));
  return true;
};
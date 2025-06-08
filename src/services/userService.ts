/**
 * ログイン中ユーザーの身長（m単位）を取得する関数
 * @param userId ユーザーID
 * @returns 身長（メートル単位）、もしくは null
 */
export const getCurrentUserHeight = (userId: string): number | null => {
  const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");
  const currentUser = storedUsers[userId];

  if (currentUser?.height) {
    const parsedHeight = parseFloat(currentUser.height);
    if (!isNaN(parsedHeight)) {
      return parsedHeight / 100;
    }
  }

  return null;
};

/**
 * ログイン中ユーザーの身長（m単位）を取得する関数（ラッパー）
 * @returns 身長（メートル単位）、もしくは null
 */
export const getLoggedInUserHeight = (): number | null => {
  const userId = localStorage.getItem("loggedInUser");
  return userId ? getCurrentUserHeight(userId) : null;
};


import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // 空のハート
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // 塗りつぶしのハート

type Post = {
  date: string;
  diary?: string;
  timestamp: string;  // undefinedを外す
  email: string;
  likeCount?: number;
};

type User = {
  name?: string;
};

const TimeLine: React.FC = () => {
  const [timelinePosts, setTimelinePosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [email: string]: User }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const allRecordsRaw = localStorage.getItem("records");
    console.log(localStorage.getItem("records"));
    const usersRaw = localStorage.getItem("users");

    if (!allRecordsRaw || !usersRaw) return;

    const allRecords = JSON.parse(allRecordsRaw);
    const usersData = JSON.parse(usersRaw);
    setUsers(usersData); // ← ここを必ず入れる

    const allPosts: Post[] = [];

    for (const [email, postsByUser] of Object.entries(allRecords)) {
      for (const [timestamp, post] of Object.entries(postsByUser as any)) {
        if ((post as Post).diary) {
          allPosts.push({
            ...(post as Post),
            timestamp,
            email,
            likeCount: (post as any).likeCount || 0, // ここを追加
          });
        }
      }
    }

    allPosts.sort(
      (a, b) =>
        new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );

    const likedPostsRaw = localStorage.getItem("likedPosts");
    if (likedPostsRaw) {
      setLikedPosts(JSON.parse(likedPostsRaw));
    }

    setTimelinePosts(allPosts);
  }, []);

  const toggleLike = (post: Post) => {
    if (!post.timestamp) return;
    const key = post.email + post.timestamp;
    const isLiked = likedPosts[key] || false;

    // likedPostsの更新
    const newLikedPosts = { ...likedPosts, [key]: !isLiked };
    setLikedPosts(newLikedPosts);
    localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts));

    // timelinePostsの更新
    setTimelinePosts((posts) => {
      const newPosts = posts.map((p) => {
        if (p.email === post.email && p.timestamp === post.timestamp) {
          return {
            ...p,
            likeCount: isLiked
              ? Math.max((p.likeCount || 1) - 1, 0)
              : (p.likeCount || 0) + 1,
          };
        }
        return p;
      });

      // localStorageのrecordsも更新
      const recordsRaw = localStorage.getItem("records");
      if (recordsRaw && post.timestamp !== undefined) {
        const records = JSON.parse(recordsRaw);

        if (records[post.email] && records[post.email][post.timestamp]) {
          records[post.email][post.timestamp].likeCount =
            newPosts.find(
              (p) => p.email === post.email && p.timestamp === post.timestamp
            )?.likeCount || 0;

          localStorage.setItem("records", JSON.stringify(records));
        }
      }

      return newPosts;
    });
  };

  return (
    <div className="user-page">
      <Header />
      <section className="user-title">
        <div>TIME LINE</div>
      </section>

      <div className="card-container">
        {timelinePosts.length === 0 ? (
          <p>日記の投稿はまだありません。</p>
        ) : (
          timelinePosts.map((post) => {
            const user = users[post.email];
            const key = post.email + post.timestamp;
            const isLiked = likedPosts[key] || false;

            return (
              <div
                key={key}
                className="record-card"
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div className="record-header">
                    <h4>{user?.name || "名前未設定"}さん</h4>
                  </div>
                  <div className="timeline-diary">{post.diary}</div>
                  <div className="timeline-date">
                    {post.timestamp
                      ? new Date(post.timestamp).toLocaleString("ja-JP")
                      : ""}
                  </div>
                </div>

                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() => toggleLike(post)}
                >
                  <FontAwesomeIcon
                    icon={isLiked ? solidHeart : regularHeart}
                    style={{
                      color: isLiked ? "red" : "gray",
                      marginRight: "6px",
                    }}
                    title={isLiked ? "いいね済み" : "いいね"}
                  />
                  <p>{post.likeCount || 0}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Footer onTabChange={() => {}} />
    </div>
  );
};

export default TimeLine;

import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons"; // 空のハート
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons"; // 塗りつぶしのハート

import {
  getAllPosts,
  getLikedPosts,
  toggleLikeLocal,
} from "../services/postService";
import type { Post, User } from "../services/postService";

const TimeLine: React.FC = () => {
  const [timelinePosts, setTimelinePosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<{ [email: string]: User }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const { posts, users } = getAllPosts();
    setTimelinePosts(posts);
    setUsers(users);
    setLikedPosts(getLikedPosts());
  }, []);

  const toggleLike = (post: Post) => {
    const key = post.id;
    const isLiked = likedPosts[key] || false;

    // localStorageに反映
    toggleLikeLocal(post, !isLiked);

    // 状態更新
    const newLiked = { ...likedPosts, [key]: !isLiked };
    setLikedPosts(newLiked);

    const newPosts = timelinePosts.map((p) =>
      p.id === post.id
        ? {
            ...p,
            likeCount: !isLiked
              ? (p.likeCount || 0) + 1
              : Math.max((p.likeCount || 1) - 1, 0),
          }
        : p
    );
    setTimelinePosts(newPosts);
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
            const isLiked = likedPosts[post.id] || false;

            return (
              <div
                key={post.id}
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
                  <div className="card-date">
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

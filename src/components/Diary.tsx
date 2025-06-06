import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type DiaryProps = {
  // data?: any[]; // ← ? をつけることで省略可能になる
};

const Diary: React.FC<DiaryProps> = () => {
  return (
    <div className="user-page">
      <Header />
      <h1>Budy日記</h1>
      <BottomNav currentTab="diary" onTabChange={() => {}} />
    </div>
  );
};

export default Diary;

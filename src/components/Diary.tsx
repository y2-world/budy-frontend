import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type DiaryProps = {
  data: { date: string; text: string }[];
};

const Diary: React.FC<DiaryProps> = ({ data }) => {
  return (
    <div className="user-page">
      <Header />
      <h1>Budy日記</h1>
      <BottomNav />
    </div>
  );
};

export default Diary;

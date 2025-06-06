import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type SettingsProps = {
  data: { date: string; text: string }[];
};

const Diary: React.FC<SettingsProps> = () => {
  return (
    <div className="user-page">
      <Header />
      <h1>設定</h1>
       <BottomNav />
    </div>
  );
};

export default Diary;
import Header from "./Header";
import BottomNav from "./BottomNav";

// Propsの型定義
type SettingsProps = {
  data?: any[]; // ← ? をつけることで省略可能になる
};

const Diary: React.FC<SettingsProps> = ({ data }) => {
  return (
    <div className="user-page">
      <Header />
      <h1>設定</h1>
       <BottomNav currentTab="settings" onTabChange={() => {}} />
    </div>
  );
};

export default Diary;
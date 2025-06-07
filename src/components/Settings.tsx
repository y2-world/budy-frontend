import Header from "./Header";
import Footer from "./Footer";

// Propsの型定義
type SettingsProps = {
  // data?: any[]; // ← ? をつけることで省略可能になる
};

const Diary: React.FC<SettingsProps> = () => {
  return (
    <div className="user-page">
      <Header />
      <section className="user-stats">
        <div>設定</div>
      </section>
       <Footer currentTab="settings" onTabChange={() => {}} />
    </div>
  );
};

export default Diary;
import Header from "./Header";
import Footer from "./Footer";

// Propsの型定義
type DiaryProps = {
  // data?: any[]; // ← ? をつけることで省略可能になる
};

const Diary: React.FC<DiaryProps> = () => {
  return (
    <div className="user-page">
      <Header />
      <section className="user-stats">
        <div>Budy日記</div>
      </section>
      <Footer currentTab="diary" onTabChange={() => {}} />
    </div>
  );
};

export default Diary;

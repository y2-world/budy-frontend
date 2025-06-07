import Header from "./Header";
import Footer from "./Footer";

// Propsの型定義
type WeightChartProps = {
  // data?: any[]; // ← ? をつけることで省略可能になる
};

const WeightChart: React.FC<WeightChartProps> = () => {
  return (
    <div className="user-page">
      <Header />
      <section className="user-stats">
        <div>体重管理</div>
      </section>
      <Footer currentTab="weight" onTabChange={() => {}} />
    </div>
  );
};

export default WeightChart;

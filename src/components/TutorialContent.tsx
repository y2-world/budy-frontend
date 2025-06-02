import "./TutorialContent.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";

function TutorialContent({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "ようこそ！",
      content: "このアプリでは、日々の食事や運動を記録できます。",
    },
    {
      title: "記録を追加",
      content: "「＋」ボタンから記録を追加できます。<br>毎日の積み重ねが大事！",
    },
    {
      title: "グラフで確認",
      content:
        "体重や消費カロリーをグラフで確認し、<br>モチベーションを維持しましょう。",
    },
    {
      title: "準備完了！",
      content:
        "さっそく始めましょう！<br>下のボタンでチュートリアルを閉じられます。",
    },
  ];

  const next = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
    else onClose(); 
  };

  return (
    <div className="tutorial-slide">
      <h2>{slides[currentSlide].title}</h2>
      <p
        dangerouslySetInnerHTML={{
          __html: slides[currentSlide].content,
        }}
      />

      <span onClick={next}>
        {currentSlide === slides.length - 1 ? <FontAwesomeIcon icon={faXmark} style={{color: "black",}} /> :  <FontAwesomeIcon icon={faArrowRight} style={{color: "black",}}  />}
      </span>
    </div>
  );
}

export default TutorialContent; 

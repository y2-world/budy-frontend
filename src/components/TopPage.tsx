import { useEffect } from "react";
import ImageSlider from "./ImageSlider";
import Modal from "./Modal";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import TutorialContent from "./TutorialContent";
import { useNavigate } from "react-router-dom"; 
import "./TopPage.css";

type TopPageProps = {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  showSignup: boolean;
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
  showTutorial: boolean;
  setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>;
  loggedInUser: string | null;
  setLoggedInUser: React.Dispatch<React.SetStateAction<string | null>>;
};

function TopPage({
  showLogin,
  setShowLogin,
  showSignup,
  setShowSignup,
  showTutorial,
  setShowTutorial,
  setLoggedInUser,
}: TopPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("seenTutorial");
    if (!hasSeenTutorial) {
      setShowTutorial(true); // チュートリアルを表示
      localStorage.setItem("seenTutorial", "true"); // 今後は表示しない
    }
  }, []);

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("loggedInUser");
    if (loggedInEmail) {
      setLoggedInUser(loggedInEmail);
    }
  }, []);

  return (
    <div className="App">
      <ImageSlider />
      <div>
        <div className="overlay">
          <div className="overlay-logo">
            <img src="./images/logo.png" alt="Budy Logo" className="logo" />
            <div className="info-button" onClick={() => setShowTutorial(true)}>
              <FontAwesomeIcon icon={faCircleInfo} style={{ color: "gray" }} />
            </div>
          </div>
          {showTutorial && (
            <Modal
              onClose={() => setShowTutorial(false)}
              showCloseButton={false}
            >
              <TutorialContent onClose={() => setShowTutorial(false)} />
            </Modal>
          )}
          <div className="buttons">
            <button onClick={() => setShowLogin(true)} className="login-button">
              Login
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="signup-button"
            >
              Sign Up
            </button>
          </div>
          {showLogin && (
            <Modal onClose={() => setShowLogin(false)}>
              <LoginForm
                onGuestLogin={() => {
                  setShowLogin(false);
                  localStorage.setItem("guestUser", "true");
                  navigate("/mypage");
                }}
                onLoginSuccess={(email: string) => {
                  setShowLogin(false);
                  localStorage.setItem("loggedInUser", email);
                  setLoggedInUser(email);
                  navigate("/mypage");
                }}
              />
            </Modal>
          )}
          {showSignup && (
            <Modal onClose={() => setShowSignup(false)}>
              <SignupForm
                onSignupSuccess={(email: string) => {
                  setShowSignup(false);
                  localStorage.setItem("loggedInUser", email);
                  setLoggedInUser(email);
                  navigate("/mypage");
                }}
              />
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopPage;

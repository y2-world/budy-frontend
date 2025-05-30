import { useState } from "react";
import ImageSlider from "./components/ImageSlider";
import Modal from "./components/Modal";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import TutorialContent from "./components/TutorialContent";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

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
                }}
              />
            </Modal>
          )}
          {showSignup && (
            <Modal onClose={() => setShowSignup(false)}>
              <SignupForm
                onGuestLogin={() => {
                  setShowSignup(false);
                  localStorage.setItem("guestUser", "true");
                }}
              />
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

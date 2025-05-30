import { useState, useEffect } from "react";
import TopPage from "./components/TopPage";
import UserPage from "./components/UserPage";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

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
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <TopPage
              showLogin={showLogin}
              setShowLogin={setShowLogin}
              showSignup={showSignup}
              setShowSignup={setShowSignup}
              showTutorial={showTutorial}
              setShowTutorial={setShowTutorial}
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
            />
          }
        />
        <Route path="/mypage" element={<UserPage />} />
      </Routes>
    </Router>
  );
}
export default App;

import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import TopPage from "./components/TopPage";
import UserPage from "./components/UserPage";
import Weight from "./components/Weight";
import Settings from "./components/Settings";
import TimeLine from "./components/TimeLine";
import Diary from "./components/Diary";

function App() {
  const location = useLocation(); // Router の中なので正常

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("seenTutorial");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      localStorage.setItem("seenTutorial", "true");
    }
  }, []);

  useEffect(() => {
    const loggedInEmail = localStorage.getItem("loggedInUser");
    if (loggedInEmail) {
      setLoggedInUser(loggedInEmail);
    }
  }, []);

  return (
    <>
      {location.pathname === "/mybudy" && <Header />}

      <Routes>
        <Route path="/mybudy" element={<UserPage />} />
        <Route path="/weight" element={<Weight />} />
        <Route path="/timeline" element={<TimeLine />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/settings" element={<Settings />} />
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
      </Routes>
    </>
  );
}

export default App;
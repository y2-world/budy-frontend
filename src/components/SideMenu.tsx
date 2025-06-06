import "../styles/SideMenu.css";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SideMenu.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const SideMenu: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("user");

      onClose();
      navigate("/"); // ログアウト後にトップページへ遷移
    }
  };

  return (
    <>
      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <ul>
          <li>
            <Link to="/mybudy" onClick={onClose}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/weight" onClick={onClose}>
              体重管理
            </Link>
          </li>
          <li>
            <Link to="/diary" onClick={onClose}>
              Budy日記
            </Link>
          </li>
           <li>
            <Link to="/timeline" onClick={onClose}>
              TIME LINE
            </Link>
          </li>
          <li>
            <Link to="/settings" onClick={onClose}>
              設定
            </Link>
          </li>
          <li>
            <div className="logout-button" onClick={handleLogout}>
              ログアウト
            </div>
          </li>
        </ul>
      </div>
      {isOpen && <div className="backdrop" onClick={onClose}></div>}
    </>
  );
};

export default SideMenu;

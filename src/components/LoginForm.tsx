import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

type LoginFormProps = {
  onGuestLogin: () => void;
  onLoginSuccess: (email: string) => void;
};

function LoginForm({ onGuestLogin, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[email] && users[email].password === password) {
      localStorage.setItem("loggedInUser", email);
      onLoginSuccess(email);
      navigate("/mypage"); // ログイン成功後にマイページへ遷移
    } else {
      setError("メールアドレスまたはパスワードが正しくありません。");
    }
  };  

  return (
    <div className="login-form">
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <label>メールアドレス</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
        <label>パスワード</label>
        <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">ログイン</button>
      </form>
      {error && <p className="error-message">{error}</p>}

      <div className="guest-link">
        <button onClick={onGuestLogin} className="guest-btn">
          ゲストユーザーとして利用する
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
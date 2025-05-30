import "./SignupForm.css";
import { useState } from "react";

type SignupFormProps = {
  onSignupSuccess: (username: string) => void;
};

function SignupForm({ onSignupSuccess }: SignupFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("すべての項目を入力してください。");
      return;
    }
    // ここでサインアップ処理を実行
    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[email]) {
      setError("このメールアドレスはすでに使用されています。");
      return;
    }

    users[email] = {
      name: username, 
      email,
      password,
    };

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", email);
    // 成功した場合はonSignupSuccessを呼び出す
    onSignupSuccess(email);
  };

  return (
    <div className="signup-form">
      <h2>新規登録</h2>
      <form onSubmit={handleSignup}>
        <label>ユーザ名</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
        <button type="submit">登録する</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SignupForm;

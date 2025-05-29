import "./LoginForm.css";

type LoginFormProps = {
  onGuestLogin: () => void;
};

function LoginForm({ onGuestLogin }: LoginFormProps) {
  return (
    <div className="login-form">
      <h2>ログイン</h2>
      <form>
        <label>メールアドレス</label>
        <input type="email" />
        <label>パスワード</label>
        <input type="password" />
        <button type="submit">ログイン</button>
      </form>

      <div className="guest-link">
        <button onClick={onGuestLogin} className="guest-btn">
          ゲストユーザーとして利用する
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
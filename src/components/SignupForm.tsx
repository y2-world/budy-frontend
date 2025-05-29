import "./SignupForm.css";

type SignupFormProps = {
  onGuestLogin: () => void;
};

function SignupForm({ onGuestLogin }: SignupFormProps) {
  return (
    <div className="signup-form">
      <h2>新規登録</h2>
      <form>
        <label>名前</label>
        <input type="text" />
        <label>メールアドレス</label>
        <input type="email" />
        <label>パスワード</label>
        <input type="password" />
        <button type="submit">登録する</button>
      </form>

      <div className="guest-link">
        <button onClick={onGuestLogin} className="guest-btn">
          ゲストユーザーとして利用する
        </button>
      </div>
    </div>
  );
}

export default SignupForm;
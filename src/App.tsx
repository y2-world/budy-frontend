import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('http://localhost/api/ping')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error(error);
        setMessage('API呼び出しに失敗しました');
      });
  }, []);

  return (
    <div>
      <h1>Budy - Your Buddy App for your body</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
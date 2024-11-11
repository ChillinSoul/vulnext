import { useState } from 'react';

function AuthPage({ onLogin }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await onLogin(username, password);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 ">
      <h2 className="text-3xl">Login</h2>
      <input
      className='border-2 border-black rounded p-2'
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
      className='border-2 border-black rounded p-2'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='border-2 border-black rounded p-2' onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AuthPage;
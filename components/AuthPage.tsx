
import React, { useState } from 'react';
import { CreditCard, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (username === 'admin' && password === 'admin') {
        onLogin({ username: 'admin', name: 'Administrator' });
        return;
      }
      if (username === 'user' && password === 'user') {
        onLogin({ username: 'user', name: 'Standard User' });
        return;
      }
      const users = JSON.parse(localStorage.getItem('paytrack_users') || '[]');
      const user = users.find((u: any) => u.username === username && u.password === password);
      if (user) onLogin({ username: user.username, name: user.name });
      else setError('Invalid credentials. Use admin/admin or user/user.');
    } else {
      if (!username || !password || !name) {
        setError('Please fill all fields');
        return;
      }
      const users = JSON.parse(localStorage.getItem('paytrack_users') || '[]');
      if (users.find((u: any) => u.username === username)) {
        setError('Username exists');
        return;
      }
      localStorage.setItem('paytrack_users', JSON.stringify([...users, { username, password, name }]));
      setIsLogin(true);
      setError('Signup successful! Please login.');
    }
  };

  const inputClasses = "w-full p-4 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 text-black font-bold placeholder:text-slate-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-100 mb-6">
            <CreditCard className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black text-blue-900 tracking-tighter">Pay Track</h1>
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100">
          <h2 className="text-xl font-bold mb-8">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className={inputClasses} 
              />
            )}
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className={inputClasses} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className={inputClasses} 
            />
            {error && <p className="text-[10px] font-black uppercase text-center text-rose-500">{error}</p>}
            <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[11px] tracking-widest shadow-lg shadow-blue-50">
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 tracking-widest">
            {isLogin ? "Don't have an account? Sign Up" : "Have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

"use client";

import { useState, useEffect } from 'react';
import AuthPage from '../auth';
import Nav from '../components/nav';

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initializeUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      const userMap = data.reduce((map: { [key: string]: string }, user: { username: string; password: string }) => {
        map[user.username] = user.password;
        return map;
      }, {});
      setUsers(userMap);
    };
    initializeUsers();
  }, []);

  const checkAuth = () => {
    return document.cookie.includes("authToken=true");
  };

  const handleLogin = async (username: string, password: string) => {
    username = username.trim();
    const hashedPassword = await hashPassword(password);
    if (users[username] && users[username] === hashedPassword) {
      document.cookie = "authToken=true; path=/";
      setIsAuthenticated(true);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (checkAuth()) {
      setIsAuthenticated(true);
    }
  }, []);

  const stealFlag = () => {
    const flag = "rAzry0-ruvmic-capweb";
    console.log("Stolen flag:", flag);
    alert("Flag stolen! Check console for details.");
  };

  if (!isAuthenticated) {
    return (
      <>
        <Nav />
        <AuthPage onLogin={handleLogin} />
      </>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Nav />
      <h1 className="text-2xl">VulNext (Authenticated)</h1>
      <div className="card">
        <button className="border rounded p-2" onClick={stealFlag}>
          Steal the flag
        </button>
        <button className="border rounded p-2" onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default App;
"use client"

import { useState, useEffect } from 'react';
import AuthPage from '../auth';

async function hashPassword(password :string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock user "database" with hashed passwords (for demo purposes)
  const [users, setUsers] = useState<{ [key: string]: string }>({});
  

  // Function to initialize mock users with hashed passwords
  useEffect(() => {
    const initializeUsers = async () => {
      setUsers({
        alice: "ea0fb1a6ec4d46ea06e068ee573c631e5d3930f10ac1601e648f7c37ff7aa71e",
        bob: "11b7eaf0ac26da906753e123a1382e597de9facd5601f4ec20e9416803f9dcbf",
        luc: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f"
      });
    };
    initializeUsers();
  }, []);

  // Function to check if the "authToken" cookie exists (for demo purposes)
  const checkAuth = () => {
    return document.cookie.includes("authToken=true");
  };

  const handleLogin = async (username:string, password:string) => {
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
    // Clear the authToken cookie by setting it to expire in the past
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
  };

  // Check authentication status on component mount
  useEffect(() => {
    if (checkAuth()) {
      setIsAuthenticated(true);
    }
  }, []);

  // Function to simulate cookie theft by logging it
  const stealFlag = () => {
    const flag = "rAzry0-ruvmic-capweb"
    console.log("Stolen flag:", flag);
    alert("Flag stolen! Check console for details.");
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <>
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-2xl">VulNext (Authenticated)</h1>
      <div className="card">
        <button className="border rounded p-2" onClick={() => stealFlag()}>
          Steal the flag
        </button>
        <button className="border rounded p-2" onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
        </div>
    </div>
    </>
  );
}

export default App;
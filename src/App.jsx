import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import TodoList from './components/TodoApp/TodoList';

function App() {
  const [user, setUser] = useState(() => {
    // Check localStorage for saved user on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    // Note: Password should NOT be stored in real applications
    if (userData.rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('oliveGroveTodo'); // Clear todo data if needed
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <AuthPage onLogin={handleLogin} />
            ) : (
              <Navigate to="/app" replace />
            )
          }
        />
        <Route
          path="/app"
          element={
            user ? (
              <TodoList onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
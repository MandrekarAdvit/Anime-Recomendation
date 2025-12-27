import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// 1. Import the AuthProvider you just created
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap App so the entire project has access to Auth state */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
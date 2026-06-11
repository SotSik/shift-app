import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminPage from './Admin';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* アプリ全体をルーターで包む */}
    <BrowserRouter>
      <Routes>
        {/* URLが 「http://localhost:3000/」 のときは通常のシフト画面を表示 */}
        <Route path="/" element={<App />} />
        {/* URLが 「http://localhost:3000/admin」 のときは管理画面を表示 */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
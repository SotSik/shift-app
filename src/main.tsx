import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminPage from './Admin';
import AdminNew from './AdminNew';
import Appnew from './Appnew';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* アプリ全体をルーターで包む */}
    <BrowserRouter>
      <Routes>
        {/* URLが 「http://localhost:3000/」 のときは通常のシフト画面を表示 */}
        <Route path="/" element={<Appnew />} />
        {/* URLが 「http://localhost:3000/admin」 のときは管理画面を表示 */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/adminNew" element={<AdminNew />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
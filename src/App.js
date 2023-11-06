import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Ranking from './pages/Ranking';
import Statistics from './pages/Statistics';
import ERoutes from './pages/ERoutes';
import Guide from './pages/Guide';

export default function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/ranking" element={<Ranking />}></Route>
          <Route path="/routes" element={<ERoutes />}></Route>
          <Route path="/statistics" element={<Statistics />}></Route>
          <Route path="/guide" element={<Guide />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Ranking from './Ranking';
import Statistics from './Statistics';
import ERoutes from './ERoutes';

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
          statistics
        </Routes>
      </BrowserRouter>
    </div>
  );
};

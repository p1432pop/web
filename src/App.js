import React, { Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Ranking from './Ranking';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/ranking" element={<Ranking />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Ranking from './pages/Ranking';
import Statistics from './pages/Statistics';
import Guide from './pages/Guide';
import Player from './pages/Player';
import SignUp from './pages/SignUp';
import SignIn from './components/SignIn';
import { useSelector } from 'react-redux';
export default function App() {
  const value = useSelector((state) => state.register);
  return (
    <div className='App'>
      <BrowserRouter>
        <Header />
        <div className='Page'>
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/ranking" element={<Ranking />}></Route>
            <Route path="/statistics" element={value.login ? <Statistics /> : <SignIn />}></Route>
            <Route path="/guide" element={<Guide />}></Route>
            <Route path="/player/:nickname" element={<Player />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

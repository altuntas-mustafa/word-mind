// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../src/redux/store';
import './App.css';
import MainPage from './Components/MainPage';
import DashBoard from './Components/Dashboard';
import Login from './Components/Login';
import Logout from './Components/Logout';
import Header from './Components/Header';


import AddDeck from './JS/AddDeck';
import Flashcards from './JS/Flashcards';


function App() {

  return (
    <Provider store={store}>
      <Router>
        <div className="w-screen border-b border-gray-400 ">
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/createdecks" element={<AddDeck />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/languages/:language/decks/:deckName" element={<Flashcards />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

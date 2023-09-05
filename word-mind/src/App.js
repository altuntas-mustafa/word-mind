// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import './App.css';
import MainPage from './Components/MainPage';
import DashBoard from './Components/Dashboard';
import Login from './Components/Login';
import Logout from './Components/Logout';
import Header from './Components/Header';


import AddDeck from './JS/AddDeck';
import Flashcards from './JS/Flashcards';
import SeeDeck from './JS/SeeDeck';


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
            <Route path="/users/:userId/languages/:language/decks/:deckName" element={<Flashcards />} />
            <Route path="/deck/users/:userId/languages/:language/decks/:deckName" element={<SeeDeck />} />
            <Route path="/deck/languages/:language/decks/:deckName" element={<SeeDeck />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import './App.css';
import Header from '../src/Components/JS/Header';
import Deck from './Components/JS/Deck';
import AddDeck from './Components/JS/AddDeck';
import ChatGpt from './ExternalApi/ChatGpt';
import Flashcards from './Components/JS/Flashcards';
import Home from './Components/JS/Home';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="w-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 border-b border-gray-400">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<Deck />} />
            <Route path="/createdecks" element={<AddDeck />} />
            <Route path="/chatgpt" element={<ChatGpt />} />
            <Route path="/languages/:language/decks/:deckName" element={<Flashcards />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

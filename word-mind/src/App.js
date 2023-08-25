import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import Deck from './Components/JS/Deck';
import Flashcards from './Components/JS/Flashcards';
import './App.css';
import AddDeck from './Components/JS/AddDeck';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="content">
          <nav className="navbar">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/decks" className="nav-link">
              View Decks
            </Link>
            <Link to="/createdecks" className="nav-link">
              Add Deck
            </Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<Deck />} />
            <Route path="/createdecks" element={<AddDeck />} />
            <Route path="/languages/:language/decks/:deckName" element={<Flashcards />} /> {/* Update this route */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

function Home() {
  
  return (
    <div>
      <p className="home-title">Home Page</p>
    </div>
  );
}

export default App;

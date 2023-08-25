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

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container mx-auto mb-8 px-8">
          <Header />
          <h1 className="mt-8 text-center text-3xl font-bold">
            Welcome To Word Mind App. Be ready to learn fucking words quickly :D
          </h1>
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

function Home() {
  return (
    <div>
      {/* Your Home component content */}
    </div>
  );
}

export default App;

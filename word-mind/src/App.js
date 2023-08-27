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
<<<<<<< HEAD
    
          <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 ">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
  <a href="https://flowbite.com/" className="flex items-center">
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Word Mind</span>
  </a>
  <div className="flex md:order-2">
      
  </div>
  <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    <li>
        <Link href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" to={"/"}> Home</Link>
      </li>
      <li>
        <Link href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" to={"/decks"} >Decks</Link>
      </li>
      <li>
        <Link href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"to={"/createdecks"}> Create Deck </Link>
      </li>
      <li>
        <Link href="#" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"to={"/chatgpt"}> Chat GPT </Link>
      </li>
    </ul>
  </div>
  </div>
    <Routes>
=======
        <div className="container mx-auto mb-8 px-8">
          <Header />
          <Routes>
>>>>>>> 7b1ef0ffc2cca39dacfd78b65693d4f01703db88
            <Route path="/" element={<Home />} />
            <Route path="/decks" element={<Deck />} />
            <Route path="/createdecks" element={<AddDeck />} />
            <Route path="/chatgpt" element={<ChatGpt />} />
<<<<<<< HEAD
            <Route path="/languages/:language/decks/:deckName" element={<Flashcards />} /> {/* Update this route */}
            </Routes>
          </nav>
    
     
      
    
           
=======
            <Route path="/languages/:language/decks/:deckName" element={<Flashcards />} />
          </Routes>
        </div>
>>>>>>> 7b1ef0ffc2cca39dacfd78b65693d4f01703db88
      </Router>
    </Provider>
  );
}

function Home() {
  return (
    <div className="mt-8 text-center">
      <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">
        Welcome To Word Mind App.
      </h1>
      <p className="mt-4 text-sm md:text-base lg:text-lg xl:text-xl">
        Be ready to learn amazing words quickly :D
      </p>
    </div>
  );
}

export default App;

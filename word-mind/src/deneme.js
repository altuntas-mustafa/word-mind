import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../src/redux/store';
import './App.css';
import Header from '../src/Components/JS/Header';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container mx-auto mb-8 px-8 ">
          <Header />
          <h1 className="mt-8 text-center text-3xl font-bold">
            Your App's Main Content
          </h1>
          {/* Your Routes */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;

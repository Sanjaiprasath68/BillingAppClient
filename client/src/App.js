import React, { useState } from 'react';
import Home from './Home';
import BillPage from './BillPage';
import Items from './components/items/Items';
import LoginPage from './LoginPage';
import Protected from './Protected';


import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(null);

  const signin = () => {
    setIsSignedIn(true)
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/home'
          element={
            <Protected isSignedIn={isSignedIn}>
              <Home />
            </Protected>} />
        <Route path='/' element={<LoginPage signin={signin}/>} />
        <Route path='/billpage' element={<BillPage />}
        <Route path='/items' element={<Items />}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React from 'react';
import Home from './Home';
import BillPage from './BillPage';
import Items from './components/items/Items';
import LoginPage from './LoginPage';

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<LoginPage />} />
        <Route path='/billpage' element={<BillPage />} />
        <Route path='/items' element={<Items />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

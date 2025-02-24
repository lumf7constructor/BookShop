import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';  // Import Header component
import Footer from './components/Footer';  // Import Footer component

import Home from './pages/Home';
import ManagerPage from './pages/ManagerPage';
import CustomerPage from './pages/CustomerPage';
import Books from './pages/Books';
import Bestsellers from './pages/Bestsellers';
import Reviews from './pages/Review';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <Header />  {/* This will display the logo on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/books" element={<Books />} />
        <Route path="/bestsellers" element={<Bestsellers />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
      <Footer />  {/* This will display the footer on all pages */}
    </Router>
  );
}

export default App;

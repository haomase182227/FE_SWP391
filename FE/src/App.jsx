import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import BikeDetail from './pages/BikeDetail';
import Wishlist from './pages/Buyer/Wishlist';
import Cart from './pages/Buyer/Cart';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <TopNavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bike/:id" element={<BikeDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            {/* Future Routes for Buyer, Seller, Inspector, Admin */}
            <Route path="/compare" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
            <Route path="/feed" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
            <Route path="/support" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <MobileNav />
      </div>
    </Router>
  );
}

export default App;

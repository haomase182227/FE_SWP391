import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import BikeDetail from './pages/BikeDetail';
import Wishlist from './pages/Buyer/Wishlist';
import Cart from './pages/Buyer/Cart';
import Wallet from './pages/Buyer/Wallet';
import AuthPage from './pages/Auth/AuthPage';
import Dashboard from './pages/Admin/Dashboard';
import NotFound from './pages/NotFound';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isAdminPage = location.pathname.startsWith('/admin');
  const hidePublicChrome = isAuthPage || isAdminPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!hidePublicChrome && <TopNavBar />}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bike/:id" element={<BikeDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/inspector" element={<div className="pt-20 p-8 text-center">Inspector Workspace Coming Soon</div>} />
          <Route path="/seller" element={<div className="pt-20 p-8 text-center">Seller Workspace Coming Soon</div>} />
          {/* Future Routes for Buyer, Seller, Inspector, Admin */}
          <Route path="/compare" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
          <Route path="/feed" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
          <Route path="/support" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!hidePublicChrome && <Footer />}
      {!hidePublicChrome && <MobileNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

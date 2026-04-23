import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import TopNavBar from './components/TopNavBar';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import BikeDetail from './pages/BikeDetail';
import Wishlist from './pages/Buyer/Wishlist';
import Cart from './pages/Buyer/Cart';
import Checkout from './pages/Buyer/Checkout';
import Wallet from './pages/Buyer/Wallet';
import Order from './pages/Buyer/Order';
import Message from './pages/Buyer/Message';
import AuthPage from './pages/Auth/AuthPage';
import Dashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import ListingModeration from './pages/Admin/ListingModeration';
import TransactionManagement from './pages/Admin/TransactionManagement';
import WalletManagement from './pages/Admin/WalletManagement';
import InspectionManagement from './pages/Admin/InspectionManagement';
import ReportManagement from './pages/Admin/ReportManagement';
import AdminReviews from './pages/Admin/AdminReviews';
import NotFound from './pages/NotFound';
import AccountSellerManagement from './pages/Seller/AccountSellerManagement';
import NewListing from './pages/Seller/NewListing';
import ListingManagement from './pages/Seller/ListingManagement';
import OderManagement from './pages/Seller/OderManagement';
import WalletSellerManagement from './pages/Seller/WalletSellerManagement';
import WalletTopupResultSeller from './pages/Seller/WalletTopupResult';
import InspectionTracking from './pages/Seller/InspectionTracking';
import MessageSellerManagement from './pages/Seller/MessageSellerManagement';
import Support from './pages/Support';
import InspectorManagement from './pages/Inspector/InspectorManagement';
import WalletTopupResult from './pages/Buyer/WalletTopupResult';
import UserProfile from './pages/UserProfile';
import SellerReviews from './pages/Seller/SellerReviews';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isSellerPage = location.pathname.startsWith('/seller');
  const isInspectorPage = location.pathname.startsWith('/inspector');
  const isChatPage = location.pathname === '/chat' || location.pathname === '/seller/messages';
  const hidePublicChrome = isAuthPage || isAdminPage || isSellerPage || isInspectorPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!hidePublicChrome && <TopNavBar />}
      <div className={isChatPage ? 'contents' : 'flex-grow'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bike/:id" element={<BikeDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/topup/result" element={<WalletTopupResult />} />
          <Route path="/order" element={<Order />} />
          <Route path="/chat" element={<Message />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/listings" element={<ListingModeration />} />
          <Route path="/admin/transactions" element={<TransactionManagement />} />
<<<<<<< HEAD
          <Route path="/admin/wallets" element={<WalletManagement />} />
=======
          <Route path="/admin/reviews" element={<AdminReviews />} />
>>>>>>> 65bd213cb73bce46a2301aa427a69484f624a1b7
          <Route path="/admin/inspections" element={<InspectionManagement />} />
          <Route path="/admin/reports" element={<ReportManagement />} />
          <Route path="/inspector" element={<InspectorManagement />} />
          <Route path="/seller" element={<Navigate to="/seller/account" replace />} />
          <Route path="/seller/account" element={<AccountSellerManagement />} />
          <Route path="/seller/listings" element={<ListingManagement />} />
          <Route path="/seller/new-listing" element={<NewListing />} />
          <Route path="/seller/orders" element={<OderManagement />} />
          <Route path="/seller/reviews" element={<SellerReviews />} />
          <Route path="/seller/messages" element={<MessageSellerManagement />} />
          <Route path="/seller/wallet" element={<WalletSellerManagement />} />
          <Route path="/seller/wallet/result" element={<WalletTopupResultSeller />} />
          <Route path="/seller/inspections" element={<InspectionTracking />} />
          {/* Future Routes for Buyer, Seller, Inspector, Admin */}
          <Route path="/compare" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
          <Route path="/feed" element={<div className="pt-20 p-8 text-center">Feature Coming Soon</div>} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!hidePublicChrome && !isChatPage && <Footer />}
      {!hidePublicChrome && !isChatPage && <MobileNav />}
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

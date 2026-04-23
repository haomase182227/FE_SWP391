import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './pages/Context/AuthContext';
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
import AdminReportManagement from './pages/Admin/AdminReportManagement';
import AdminReviews from './pages/Admin/AdminReviews';
import NotFound from './pages/NotFound';
import AccountSellerManagement from './pages/Seller/AccountSellerManagement';
import NewListing from './pages/Seller/NewListing';
import ListingManagement from './pages/Seller/ListingManagement';
import OderManagement from './pages/Seller/OderManagement';
import WalletSellerManagement from './pages/Seller/WalletSellerManagement';
import MessageSellerManagement from './pages/Seller/MessageSellerManagement';
import Support from './pages/Support';
import InspectorManagement from './pages/Inspector/InspectorManagement';
import InspectorReports from './pages/Inspector/InspectorReports';
import WalletTopupResult from './pages/Buyer/WalletTopupResult';
import UserProfile from './pages/UserProfile';
import GoogleCallback from './pages/Auth/GoogleCallback';
import Search from './pages/Search';
import SellerReviews from './pages/Seller/SellerReviews';

// Redirect về đúng trang nếu role không phải Buyer
function BuyerOnly({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return children;
  switch (currentUser.role) {
    case 'Admin':     return <Navigate to="/admin/dashboard" replace />;
    case 'Inspector': return <Navigate to="/inspector" replace />;
    case 'Seller':    return <Navigate to="/seller/account" replace />;
    default:          return children;
  }
}

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
          <Route path="/" element={<BuyerOnly><Home /></BuyerOnly>} />
          <Route path="/bike/:id" element={<BikeDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/topup/result" element={<WalletTopupResult />} />
          <Route path="/order" element={<Order />} />
          <Route path="/chat" element={<Message />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/listings" element={<ListingModeration />} />
          <Route path="/admin/transactions" element={<TransactionManagement />} />
          <Route path="/admin/wallets" element={<WalletManagement />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/inspections" element={<InspectionManagement />} />
          <Route path="/admin/reports" element={<AdminReportManagement />} />
          <Route path="/inspector" element={<InspectorManagement />} />
          <Route path="/inspector/management" element={<InspectorManagement />} />
          <Route path="/inspector/reports" element={<InspectorReports />} />
          <Route path="/seller" element={<Navigate to="/seller/account" replace />} />
          <Route path="/seller/account" element={<AccountSellerManagement />} />
          <Route path="/seller/listings" element={<ListingManagement />} />
          <Route path="/seller/new-listing" element={<NewListing />} />
          <Route path="/seller/orders" element={<OderManagement />} />
          <Route path="/seller/reviews" element={<SellerReviews />} />
          <Route path="/seller/messages" element={<MessageSellerManagement />} />
          <Route path="/seller/wallet" element={<WalletSellerManagement />} />
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

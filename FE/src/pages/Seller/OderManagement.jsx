import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';

const TABS = ['All Orders', 'Shipping (3)', 'Escrow (5)', 'Completed'];

const ORDERS = [
  {
    id: 'VK-8829',
    title: 'Specialized S-Works Tarmac SL8',
    date: 'Ordered Oct 24, 2023',
    buyer: 'Jonathan Wick',
    buyerSub: 'Verified Buyer',
    buyerVerified: true,
    price: '$12,500.00',
    priceHighlight: true,
    status: 'Shipping',
    statusStyle: 'bg-secondary text-on-secondary',
    statusNote: 'In transit via FedEx',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxxNVOIUzZJyIHgxFdYW9CWPs-f3HkIpgsf0kckwVHjcM1sZoqlAifecpPLhnZoTfgEeTAugVq9rhYg83nQXg_B5l55tvKYsQ7vIpfiWYIYRHIerZLAetavaVBz2mii7ZLmgjAC8Z7vLfhN-i_GJJFmLGhGk2K3v_9729n1Bf4LDbV1i0yGtoGXLRVgSs4-UODvb7h0FO6v4Z1vTOt6wrdf_JkumgDSvANVrfVTyFy5sxwpNfS52GtF_550HGs45xkkCDki8hNuEyE',
    actions: 'confirm',
    completed: false,
  },
  {
    id: 'VK-8835',
    title: 'Canyon Aeroad CFR Mover',
    date: 'Ordered Oct 22, 2023',
    buyer: 'Elena Rodriguez',
    buyerSub: 'Regional Pro-Team',
    buyerVerified: false,
    price: '$9,200.00',
    priceHighlight: false,
    status: 'Paid - Escrow',
    statusStyle: 'bg-tertiary text-on-tertiary',
    statusNote: 'Funds secured',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmDr2Bcujoxe0MQvTQiunFRUUOnBUn5SB6aBWL7PaQuBfbnEfn4GnXo2OnJLrp69gmS6iadU7P7vNTd4xlJYONOX1gvPupJtzcBq_Rwo9P0BWJdCLN-l_LEP2xKFb9LXXzD4z3c7p76igfcoMgKVYXCEKdlqt0C1VdfjY5k_KndCoYAuvUA6pXQ8I5K2nVEtUObigiVJdSE4NoH9cznsrBxWnfHJCdoHL21hdypCkomWDEhoyAPWsX0K7q_OLRWPy7qP9CmX9-eRi1',
    actions: 'escrow',
    completed: false,
  },
  {
    id: 'VK-8812',
    title: 'Pinarello Dogma F12 Custom',
    date: 'Ordered Oct 15, 2023',
    buyer: 'Sarah Chen',
    buyerSub: 'New York, NY',
    buyerVerified: false,
    price: '$14,750.00',
    priceHighlight: false,
    status: 'Delivered',
    statusStyle: 'bg-surface-container-high text-on-surface-variant',
    statusNote: 'Pending approval',
    statusNoteStyle: 'text-tertiary font-bold',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4TK36_hf1uOj5fPXSn4R5WayehxN6KfURyOo1ie_bMeS2arH79GkFV3N_3OHHVZI6A-3LKqVtflERxfTWIFKuND5oLa3_Iuw1AW5ndj7HMH_5DXKXhrU84elLtQufuE90141Rqf121zZK6GwAtQFg9eaesLNSTbuzag4_snO2aMUQPWB3AovYpRIctcseLwe9D7OwWUu5lNWWmj3RpzQ85CeK3R7wp-EnxTsCergEQT3UdWgVXaNpqCcGVphRU0DS3W6NQ4Opo56a',
    actions: 'details',
    completed: false,
  },
  {
    id: 'VK-8798',
    title: 'Bianchi Oltre XR4',
    date: 'Ordered Oct 02, 2023',
    buyer: 'Tom Harrison',
    buyerSub: 'London, UK',
    buyerVerified: false,
    price: '$6,400.00',
    priceHighlight: false,
    status: 'Completed',
    statusStyle: 'bg-tertiary-container text-on-tertiary-container',
    statusNote: 'Funds released',
    statusNoteStyle: 'text-tertiary font-bold',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkoH_Rmx4tiI91Zy6zVsWsflDeQ8NWu4wBNPjGGqLayl-caEMlmfLl7KGFHLn5PcT0ZExw6Kf9g9k7ZscWtKCoXCFALOXrtN79qBE7kj0QU_92eHqMYeTqoCWjgap9Dd6VcvqE5jYVeeooYaDp-LU0CLU663xKtHom7-0-8kZgndsOlh1NPTOB2y4XSoK7Pfz2lTlTVfqBGcbY0p5YnyKxTJ5B8dlJkhR_NHPunssqaGA5uiTCVWfliDOnk_pM3hwOIlE8sTA16TNv',
    actions: 'stars',
    completed: true,
  },
];

function OrderActions({ actions }) {
  if (actions === 'confirm') {
    return (
      <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary font-label font-bold uppercase text-[10px] px-6 py-3 rounded-lg active:scale-95 transition-transform whitespace-nowrap">
        Confirm Delivery
      </button>
    );
  }
  if (actions === 'escrow') {
    return (
      <div className="flex gap-3">
        <button className="text-[10px] font-label font-bold uppercase border border-outline-variant/30 px-4 py-2 rounded-lg hover:bg-surface-container transition-colors">
          Print Label
        </button>
        <button className="text-[10px] font-label font-bold uppercase text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors">
          Update Shipping
        </button>
      </div>
    );
  }
  if (actions === 'details') {
    return (
      <button className="text-[10px] font-label font-bold uppercase text-on-surface-variant px-4 py-2 hover:underline">
        View Details
      </button>
    );
  }
  if (actions === 'stars') {
    return (
      <div className="flex items-center gap-1 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
            star
          </span>
        ))}
      </div>
    );
  }
  return null;
}

export default function OderManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const filtered = ORDERS.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.buyer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuDcO1STGLhu5TxCCSv7SSnJWDsyPut-fCrimCyvQL3SCtMfecIqWIZzWS4RTZwLx_Gzc9Lh6kUqp5K96x-dMmTszn_OnXQYZFxKggkuXAFfpj4RYPRGSsTbipYVRWXE3D9zJGhTANMhVn9Prx1taHfWhO71Wpyg_fZZ2_qotE3DEk9EcaOJrWlWiJNooEtiQgftVupOMICXk7Z1nT5misFZVOqevlwK4uTkBUnpYxXlNns4kdpNyob2_RXK5FA8jEVN76uBuSiQbgoB"
        merchantName="Marcus Velo"
        merchantSub="Elite Seller"
        bottomButton="Create Listing"
        onBottomButtonClick={() => navigate('/seller/listings')}
      />

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 ml-64 bg-surface/80 backdrop-blur-xl h-16 shadow-sm shadow-on-surface/5">
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
              search
            </span>
            <input
              className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64"
              placeholder="Search orders..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors">notifications</span>
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors">settings</span>
          </div>
          <button className="text-sm font-medium hover:text-primary transition-colors">Support</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 p-10 min-h-screen">
        {/* Hero Header */}
        <section className="mb-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2">Order Management</h2>
              <p className="text-on-surface-variant max-w-md">
                Track your high-performance inventory movement and handle logistics with precision velocity.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Active Revenue</p>
                <p className="font-headline text-2xl font-bold text-secondary">$42,850.00</p>
              </div>
              <div className="w-px h-10 bg-outline-variant/20 self-center" />
              <div className="text-right">
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Pending Shipments</p>
                <p className="font-headline text-2xl font-bold text-primary">03</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-outline-variant/10">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`pb-4 text-sm transition-colors ${
                activeTab === i
                  ? 'border-b-2 border-primary text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((order) => (
            <div
              key={order.id}
              className={`bg-surface-container-lowest rounded-xl p-6 flex items-center gap-8 transition-all hover:bg-primary-container/5 editorial-shadow ${
                order.completed ? 'opacity-75 grayscale hover:grayscale-0' : ''
              }`}
              style={{ boxShadow: '0 20px 40px rgba(78, 33, 32, 0.06)' }}
            >
              <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                <img
                  alt={order.title}
                  src={order.img}
                  className="w-full h-full object-cover mix-blend-multiply"
                />
              </div>

              <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                {/* Title */}
                <div className="col-span-3">
                  <p className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant">Order #{order.id}</p>
                  <h4 className="font-headline font-bold text-lg leading-tight">{order.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{order.date}</p>
                </div>

                {/* Buyer */}
                <div className="col-span-2">
                  <p className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant">Buyer</p>
                  <p className="font-semibold text-sm">{order.buyer}</p>
                  {order.buyerVerified ? (
                    <p className="text-[10px] text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                        verified
                      </span>
                      Verified Buyer
                    </p>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant font-medium">{order.buyerSub}</p>
                  )}
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <p className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant">Total Price</p>
                  <p className={`font-headline font-bold text-lg ${order.priceHighlight ? 'text-primary' : 'text-on-surface'}`}>
                    {order.price}
                  </p>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.statusStyle}`}>
                    {order.status}
                  </span>
                  <p className={`text-[10px] mt-1 ${order.statusNoteStyle || 'text-on-surface-variant'}`}>
                    {order.statusNote}
                  </p>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex justify-end">
                  <OrderActions actions={order.actions} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-between items-center border-t border-outline-variant/10 pt-8">
          <p className="text-sm text-on-surface-variant italic">Showing 1-4 of 124 completed orders</p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-on-primary font-bold'
                    : 'border border-outline-variant/30 hover:bg-surface-container'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

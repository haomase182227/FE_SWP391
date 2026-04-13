import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';

const MOCK_LISTINGS = [
  {
    id: 'LT-001',
    title: 'S-Works Tarmac SL8',
    brand: 'Specialized',
    category: 'Road',
    year: 2023,
    price: 12500,
    condition: 'Pristine',
    status: 'Active',
    views: 284,
    createdAt: 'Oct 10, 2023',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxxNVOIUzZJyIHgxFdYW9CWPs-f3HkIpgsf0kckwVHjcM1sZoqlAifecpPLhnZoTfgEeTAugVq9rhYg83nQXg_B5l55tvKYsQ7vIpfiWYIYRHIerZLAetavaVBz2mii7ZLmgjAC8Z7vLfhN-i_GJJFmLGhGk2K3v_9729n1Bf4LDbV1i0yGtoGXLRVgSs4-UODvb7h0FO6v4Z1vTOt6wrdf_JkumgDSvANVrfVTyFy5sxwpNfS52GtF_550HGs45xkkCDki8hNuEyE',
    inspected: true,
  },
  {
    id: 'LT-002',
    title: 'Canyon Aeroad CFR Mover',
    brand: 'Canyon',
    category: 'Road',
    year: 2022,
    price: 9200,
    condition: 'Excellent',
    status: 'Active',
    views: 157,
    createdAt: 'Oct 12, 2023',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmDr2Bcujoxe0MQvTQiunFRUUOnBUn5SB6aBWL7PaQuBfbnEfn4GnXo2OnJLrp69gmS6iadU7P7vNTd4xlJYONOX1gvPupJtzcBq_Rwo9P0BWJdCLN-l_LEP2xKFb9LXXzD4z3c7p76igfcoMgKVYXCEKdlqt0C1VdfjY5k_KndCoYAuvUA6pXQ8I5K2nVEtUObigiVJdSE4NoH9cznsrBxWnfHJCdoHL21hdypCkomWDEhoyAPWsX0K7q_OLRWPy7qP9CmX9-eRi1',
    inspected: true,
  },
  {
    id: 'LT-003',
    title: 'Pinarello Dogma F12 Custom',
    brand: 'Pinarello',
    category: 'Road',
    year: 2021,
    price: 14750,
    condition: 'Good',
    status: 'Sold',
    views: 412,
    createdAt: 'Sep 28, 2023',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4TK36_hf1uOj5fPXSn4R5WayehxN6KfURyOo1ie_bMeS2arH79GkFV3N_3OHHVZI6A-3LKqVtflERxfTWIFKuND5oLa3_Iuw1AW5ndj7HMH_5DXKXhrU84elLtQufuE90141Rqf121zZK6GwAtQFg9eaesLNSTbuzag4_snO2aMUQPWB3AovYpRIctcseLwe9D7OwWUu5lNWWmj3RpzQ85CeK3R7wp-EnxTsCergEQT3UdWgVXaNpqCcGVphRU0DS3W6NQ4Opo56a',
    inspected: false,
  },
  {
    id: 'LT-004',
    title: 'Bianchi Oltre XR4',
    brand: 'Bianchi',
    category: 'Road',
    year: 2022,
    price: 6400,
    condition: 'Excellent',
    status: 'Sold',
    views: 198,
    createdAt: 'Sep 15, 2023',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkoH_Rmx4tiI91Zy6zVsWsflDeQ8NWu4wBNPjGGqLayl-caEMlmfLl7KGFHLn5PcT0ZExw6Kf9g9k7ZscWtKCoXCFALOXrtN79qBE7kj0QU_92eHqMYeTqoCWjgap9Dd6VcvqE5jYVeeooYaDp-LU0CLU663xKtHom7-0-8kZgndsOlh1NPTOB2y4XSoK7Pfz2lTlTVfqBGcbY0p5YnyKxTJ5B8dlJkhR_NHPunssqaGA5uiTCVWfliDOnk_pM3hwOIlE8sTA16TNv',
    inspected: true,
  },
  {
    id: 'LT-005',
    title: 'Trek Émonda SLR 9',
    brand: 'Trek',
    category: 'Road',
    year: 2023,
    price: 11200,
    condition: 'Pristine',
    status: 'Draft',
    views: 0,
    createdAt: 'Oct 16, 2023',
    img: null,
    inspected: false,
  },
  {
    id: 'LT-006',
    title: 'Santa Cruz Hightower CC',
    brand: 'Santa Cruz',
    category: 'MTB',
    year: 2022,
    price: 7800,
    condition: 'Good',
    status: 'Active',
    views: 93,
    createdAt: 'Oct 05, 2023',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY1mgDFs04s2iMDkhAKGq_ZDoOLDUSddniDMcbC1HLwwQm8F68y7JGMY4WsxZHEC2XTup-h13VqoHqrqs5Vm1NbVuSU02_w_j45MBsWVT_XKFzjQjL1H_rij0Mk4RLuDQossMvTZ024hxNEhbJ6pUzJxp1Xz60yDAW5pEtlnLF7SLF8oI4g5bEmrUZrM-rBnCTLGeF0HoVJSUc2ZiEl_D8d8ud3xRF4rChthtNuSM8-zMZX9z98TiSpr92oiFV2R77gMSWW7pM-tn1',
    inspected: false,
  },
];

const STATUS_STYLES = {
  Active: 'bg-tertiary text-on-tertiary',
  Sold: 'bg-surface-container-highest text-on-surface-variant',
  Draft: 'border border-outline-variant/40 text-on-surface-variant',
};

const TABS = ['All', 'Active', 'Sold', 'Draft'];

export default function ListingManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = MOCK_LISTINGS.filter((l) => {
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.brand.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 0) return matchSearch;
    const tabMap = ['', 'Active', 'Sold', 'Draft'];
    return matchSearch && l.status === tabMap[activeTab];
  });

  const stats = {
    total: MOCK_LISTINGS.length,
    active: MOCK_LISTINGS.filter((l) => l.status === 'Active').length,
    sold: MOCK_LISTINGS.filter((l) => l.status === 'Sold').length,
    draft: MOCK_LISTINGS.filter((l) => l.status === 'Draft').length,
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBh9Q9_fY-ouIys8629M86NNrQJIg92nQPcsJBqsXJZe9JpIhS_4O1BTYPv6fkdx04128V339iWFKnNo_2Qr2SCEeG3KOprb0-a1xryQOoKlWYaroBr_3zxSEq93pDeHfCo5AyQ-ftWamMd7IcvofnitwdqZXx-RAD5G6KMyqeXfLaziiaP1Ig4EEH5mU7CSa1EepNIY7zxxpqShMFh8jA23nv3-zh7sqZpkw48OONfi7nkBORuEiHz0GY2ULX-k-NroVgz4NXuCD3H"
        merchantName="Verified Merchant"
        merchantSub="Seller Dashboard"
        bottomButton="+ New Listing"
        onBottomButtonClick={() => navigate('/seller/new-listing')}
      />

      {/* Top Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 ml-64 h-16 bg-surface/80 backdrop-blur-xl shadow-sm shadow-on-surface/5">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none focus:ring-1 focus:ring-primary/20 text-sm rounded-lg placeholder:text-on-surface-variant/50"
            placeholder="Search listings..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 ml-6">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
            notifications
          </span>
          <button
            onClick={() => navigate('/seller/new-listing')}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Listing
          </button>
        </div>
      </header>

      <main className="ml-64 p-10 min-h-screen">
        {/* Header */}
        <section className="mb-10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Inventory</p>
              <h1 className="text-5xl font-bold tracking-tighter font-headline text-on-surface">My Listings</h1>
            </div>
            {/* Stats */}
            <div className="flex gap-6">
              {[
                { label: 'Total', value: stats.total, color: 'text-on-surface' },
                { label: 'Active', value: stats.active, color: 'text-tertiary' },
                { label: 'Sold', value: stats.sold, color: 'text-secondary' },
                { label: 'Draft', value: stats.draft, color: 'text-on-surface-variant' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="w-px h-10 bg-outline-variant/20 self-center" />}
                  <div className="text-right">
                    <p className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">{s.label}</p>
                    <p className={`text-2xl font-bold font-headline ${s.color}`}>{s.value}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-primary/30 via-outline-variant/10 to-transparent" />
        </section>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between p-2 bg-surface-container-low rounded-xl mb-8">
          <div className="flex gap-1">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2 text-xs uppercase tracking-tight font-semibold rounded-lg transition-colors ${
                  activeTab === i
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab}
                {tab !== 'All' && (
                  <span className="ml-1.5 opacity-60">
                    ({MOCK_LISTINGS.filter((l) => l.status === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pr-2 text-[10px] font-bold uppercase text-on-surface-variant tracking-widest">
            <span className="material-symbols-outlined text-sm">sort</span>
            {filtered.length} results
          </div>
        </div>

        {/* Listing Cards */}
        <div className="grid grid-cols-1 gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">directions_bike</span>
              <p className="font-bold uppercase tracking-widest text-xs">No listings found</p>
            </div>
          ) : (
            filtered.map((listing) => (
              <div
                key={listing.id}
                className="group bg-surface-container-lowest rounded-xl p-5 flex items-center gap-6 hover:bg-primary-container/5 transition-all"
                style={{ boxShadow: '0 20px 40px rgba(78,33,32,0.04)' }}
              >
                {/* Image */}
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                  {listing.img ? (
                    <img
                      src={listing.img}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant/30">directions_bike</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                  {/* Title */}
                  <div className="col-span-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{listing.id}</p>
                    <h3 className="font-headline font-bold text-base leading-tight mt-0.5">{listing.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-on-surface-variant">{listing.brand} · {listing.category} · {listing.year}</span>
                      {listing.inspected && (
                        <span className="flex items-center gap-0.5 text-[10px] text-tertiary font-bold">
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
                          Inspected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Price</p>
                    <p className="font-headline font-bold text-lg text-primary">
                      ${listing.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Condition */}
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Condition</p>
                    <p className="text-sm font-semibold">{listing.condition}</p>
                  </div>

                  {/* Views */}
                  <div className="col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5">Views</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">visibility</span>
                      {listing.views}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[listing.status]}`}>
                      {listing.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end gap-2">
                    {listing.status === 'Draft' ? (
                      <button
                        onClick={() => navigate('/seller/new-listing')}
                        className="text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 px-3 py-2 rounded-lg hover:bg-primary/5 transition-colors"
                      >
                        Continue
                      </button>
                    ) : (
                      <>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant border border-outline-variant/30 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors">
                          Edit
                        </button>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors px-2 py-2 rounded-lg hover:bg-error-container/10">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-8 border-t border-outline-variant/10 flex justify-between items-center">
          <p className="text-sm text-on-surface-variant italic">
            Showing {filtered.length} of {MOCK_LISTINGS.length} listings
          </p>
          <button
            onClick={() => navigate('/seller/new-listing')}
            className="flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest shadow-[0_10px_30px_rgba(168,49,0,0.2)] hover:bg-primary-dim transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create New Listing
          </button>
        </div>
      </main>
    </div>
  );
}

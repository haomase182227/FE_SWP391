import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function BikeDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`https://swp391-bike-marketplace-backend-1.onrender.com/api/v1/listings/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        const data = await response.json();
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
        <div className="text-center">Listing not found</div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-32 max-w-screen-2xl mx-auto px-8">
      {/* Breadcrumb & Title Section */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant uppercase tracking-widest mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Marketplace</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span>{listing.technicalSpecs?.Category || 'Category'}</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary">{listing.title}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-6xl font-headline font-bold tracking-tighter text-on-surface">{listing.title}</h1>
            <p className="text-xl text-on-surface-variant font-light mt-2">{listing.description || 'No description available'}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-headline font-bold text-primary tracking-tight">${listing.price.toLocaleString()}</div>
            <div className="flex gap-2 justify-end mt-2">
              {listing.isVerified && (
                <span className="px-3 py-1 bg-tertiary text-on-tertiary rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span> Verified
                </span>
              )}
              <span className="px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>speed</span> {listing.status || 'Available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Asymmetric Editorial Gallery */}
      <section className="grid grid-cols-12 gap-6 mb-24">
        <div className="col-span-12 md:col-span-8 aspect-[16/9] bg-surface-container-low rounded-xl overflow-hidden relative group cursor-zoom-in">
          <img 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt={listing.title} 
            src={listing.imageUrl}
          />
          <div className="absolute bottom-6 left-6 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md p-2 rounded-lg editorial-shadow material-symbols-outlined">fullscreen</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-6">
          {listing.additionalImages && listing.additionalImages.length > 0 ? (
            listing.additionalImages.slice(0, 2).map((img, index) => (
              <div key={index} className="bg-surface-container-low rounded-xl overflow-hidden aspect-square">
                <img 
                  className="w-full h-full object-cover" 
                  alt={`Additional image ${index + 1}`} 
                  src={img}
                />
              </div>
            ))
          ) : (
            <>
              <div className="bg-surface-container-low rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                <span className="text-on-surface-variant">No additional images</span>
              </div>
              <div className="bg-surface-container-low rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                <span className="text-on-surface-variant">No additional images</span>
              </div>
            </>
          )}
        </div>
        <div className="col-span-12 flex gap-6 overflow-x-auto no-scrollbar pb-4">
          {listing.additionalImages && listing.additionalImages.map((img, index) => (
            <div key={index} className="flex-none w-48 aspect-square bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                alt={`Thumbnail ${index + 1}`} 
                src={img}
              />
            </div>
          ))}
          <div className="flex-none w-48 aspect-square bg-surface-container-lowest rounded-lg border border-outline-variant/10 flex items-center justify-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-primary text-4xl">add</span>
          </div>
        </div>
      </section>

      {/* Product Details Grid */}
      <div className="grid grid-cols-12 gap-16">
        {/* Left Column: Specs & Inspection */}
        <div className="col-span-12 lg:col-span-8 space-y-24">
          
          {/* Spec Grid Component */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Technical Specifications</h2>
              <div className="h-px bg-outline-variant/20 flex-grow"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
              {listing.technicalSpecs && Object.entries(listing.technicalSpecs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-end border-b border-outline-variant/10 pb-4">
                  <span className="text-xs font-label text-on-surface-variant uppercase tracking-widest">{key}</span>
                  <span className="text-lg font-headline font-bold text-on-surface">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Description Section */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-headline font-bold tracking-tight">Description</h2>
              <div className="h-px bg-outline-variant/20 flex-grow"></div>
            </div>
            <p className="text-on-surface leading-relaxed">{listing.description || 'No description available.'}</p>
          </section>

          {/* Inspection Report Section - Placeholder */}
          <section className="bg-surface-container-low rounded-xl p-10 editorial-shadow">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs font-label text-secondary font-bold uppercase tracking-[0.2em] mb-1">Authentic Performance</div>
                <h2 className="text-3xl font-headline font-bold tracking-tight">Inspection Report</h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-headline font-bold text-tertiary">N/A</div>
                <div className="text-[10px] font-bold text-on-surface-variant uppercase">Pending Inspection</div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest rounded-lg p-6 mb-8 border border-secondary/5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-none">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Inspector placeholder" 
                    src="https://via.placeholder.com/48"
                  />
                </div>
                <div>
                  <div className="font-bold text-on-surface">Inspector</div>
                  <div className="text-xs text-on-surface-variant mb-4">Certified Mechanic</div>
                  <p className="text-on-surface leading-relaxed italic">
                      "Inspection report will be available soon."
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Pending</div>
              </div>
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Pending</div>
              </div>
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Pending</div>
              </div>
              <div className="bg-white/50 p-4 rounded text-center">
                <span className="material-symbols-outlined text-tertiary mb-2" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Pending</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Transactions & Seller */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Action Card */}
          <div className="sticky top-28 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/10 editorial-shadow">
            <div className="space-y-4 mb-8">
              <button className="w-full bg-gradient-to-r from-primary to-primary-fixed text-on-primary py-5 rounded-lg font-headline font-bold text-xl uppercase tracking-widest scale-[0.98] hover:scale-100 active:scale-95 transition-all shadow-lg shadow-primary/20 cursor-pointer">
                  Đặt cọc / Mua ngay
              </button>
              <button className="w-full bg-surface-container-low text-on-background py-4 rounded-lg font-label font-bold text-sm uppercase tracking-wider hover:bg-secondary-container/30 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <span className="material-symbols-outlined text-lg">chat_bubble</span> Chat với người bán
              </button>
            </div>
            
            <div className="space-y-6 pt-8 border-t border-outline-variant/10">
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary">security</span>
                <div>
                  <div className="font-bold text-sm">Escrow Protection</div>
                  <div className="text-xs text-on-surface-variant">Funds are held safely until you confirm delivery and condition.</div>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <div>
                  <div className="font-bold text-sm">Premium Logistics</div>
                  <div className="text-xs text-on-surface-variant">White-glove bike delivery across major metropolitan areas.</div>
                </div>
              </div>
            </div>

            {/* Seller Profile */}
            <div className="mt-12 pt-8 border-t border-outline-variant/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant">Seller Information</h3>
                <span className="text-[10px] px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded-full font-bold">SELLER</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">person</span>
                </div>
                <div>
                  <div className="font-headline font-bold text-lg">{listing.sellerName}</div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="text-xs font-bold ml-1 text-on-surface">Rating</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Email:</span>
                  <span className="text-sm font-bold text-on-surface">{listing.sellerEmail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Phone:</span>
                  <span className="text-sm font-bold text-on-surface">{listing.sellerPhone}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

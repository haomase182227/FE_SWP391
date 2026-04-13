import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';

const CONDITIONS = ['Pristine', 'Excellent', 'Good', 'Fair'];

const PLACEHOLDER_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBrNc09gNCpwKbW1b9g9bfzMyjUhRg-n6riYmNWBFrMMGJZXjzMLq-4Z1mwhmrlf17D2WkL5y0JvuWwBG8sbvS8Iuuo9sd4hJEUvI-5wlbM0oG608eeURY46m642li_9HgLggc-H3yIfrQSTea02HHImamBbiyO8nwmwZogR7DVRfggBEnPHlgJLmJGvnmMUrQ-ZGZW2NmB2642XU2X7hV9NCVJJcmx4ltC277koB7LqXw4LaY7-dkpM6nF3wlSEn8BApQMqQq7Wmf5',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDFnoSogguWO9DqUhgjMak24CCbwZu3nIrPu_0MHhZA2LACR7P_UoCJIHrrnJzAAI2EE539u5dG3PhNMbiLsWQ4CV5v0WLCYWgavqIhilbPi1WelASOXUKnONrLyq0P7A4-oKVCDa-ETWqfzP-e6SzYKs4BlzNFEJ3sYAZmxvZYphSb1X5ylaa_Xak21YBY5d2h_fO3mCnEuTGHiSI7F9XEP8Z3JXLBTeHJDiqKaQjBbz9xpogMVPnzxjVKbQ9OCvjfubtNLuAz-0Sk',
];

export default function NewListing() {
  const [condition, setCondition] = useState('Pristine');
  const [inspectionEnabled, setInspectionEnabled] = useState(true);
  const [images, setImages] = useState(PLACEHOLDER_IMAGES);
  const [form, setForm] = useState({
    title: '', brand: 'Specialized', model: '', category: 'Road',
    year: '', price: '', frameMaterial: '', groupset: '',
    wheelset: '', weight: '', frameSize: '52 cm',
    description: '', usageKm: '', lastService: '',
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setImages((prev) => [...prev, url]);
    });
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ form, condition, inspectionEnabled, images });
  };

  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        brandName="Pro-Tour Seller"
        avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBqbF9iNTv0bf12Xf_6OXCV8ABGhUJ13qL3Skz87MXP9Z_Gg_67pryu_bzTsFeYh5zumD-CWuZuYJCr7cz4m6fab0MRt3mUYxHZgs3-frNGSKKv-ymzNlmNDz_rmK5q--8c7V7z3q_7Y6197v12Q39EdH8tpFH93Bvt6JtO2mDROzGAW3sQwYdQz-Rj6q9piqEIUN9j9WSrQxVkg2a2UQYDzK2Zq4QVowKJQCOjP-Rj3FhqIeOuAG4bVxx6CLCH_8rFQAucJZXGuQvG"
        merchantName="Verified Merchant"
        merchantSub="Seller Dashboard"
        bottomButton="List New Bike"
        onBottomButtonClick={() => navigate('/seller/listings')}
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-8 md:p-12 max-w-7xl">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-secondary font-headline font-bold text-xs uppercase tracking-[0.2em]">
              Inventory Management
            </span>
            <div className="h-[1px] w-12 bg-secondary opacity-30" />
          </div>
          <h1 className="text-6xl font-headline font-black text-on-background tracking-tighter leading-none mb-4">
            New Listing <span className="text-primary italic">Detail.</span>
          </h1>
          <p className="max-w-2xl text-on-surface-variant font-body leading-relaxed">
            Precision is the difference between a sale and a masterpiece. Provide technical specifications,
            rich media, and verified history to engage high-performance buyers.
          </p>
        </header>

        <form className="space-y-16" onSubmit={handleSubmit}>
          {/* Section 01: Basic Information */}
          <section id="basic-info">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">01</span>
                <h2 className="font-headline font-bold uppercase text-xs tracking-widest text-primary">Basic Information</h2>
              </div>
              <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="col-span-full">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Listing Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body text-on-surface placeholder-on-surface-variant/40 rounded"
                    placeholder="e.g. S-Works Tarmac SL7 - Custom Build"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Brand</label>
                  <select
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body text-on-surface rounded"
                  >
                    {['Specialized', 'Trek', 'Canyon', 'Pinarello'].map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Model</label>
                  <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body rounded"
                    placeholder="Tarmac SL7"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body rounded"
                  >
                    {['Road', 'MTB', 'Gravel', 'Time Trial'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Year</label>
                    <input
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body rounded"
                      placeholder="2023"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Price (USD)</label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-headline font-bold text-primary rounded"
                      placeholder="12,500"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Technical Specs */}
          <section id="specs">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">02</span>
                <h2 className="font-headline font-bold uppercase text-xs tracking-widest text-primary">Technical Specs</h2>
              </div>
              <div className="md:w-3/4">
                <div className="bg-surface-container-low p-8 rounded-xl border-l-4 border-primary">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    {[
                      { label: 'Frame Material', name: 'frameMaterial', placeholder: 'Carbon Fiber' },
                      { label: 'Groupset', name: 'groupset', placeholder: 'Shimano Dura-Ace Di2' },
                      { label: 'Wheelset', name: 'wheelset', placeholder: 'Roval Rapide CLX' },
                      { label: 'Weight (KG)', name: 'weight', placeholder: '6.8 kg' },
                    ].map((spec) => (
                      <div key={spec.name} className="flex justify-between items-end border-b border-outline-variant/20 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-body">
                          {spec.label}
                        </span>
                        <input
                          name={spec.name}
                          value={form[spec.name]}
                          onChange={handleChange}
                          className="bg-transparent border-none p-0 focus:ring-0 text-right font-headline font-bold text-on-surface placeholder-on-surface-variant/30 w-40"
                          placeholder={spec.placeholder}
                          type="text"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between items-end border-b border-outline-variant/20 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-body">Frame Size</span>
                      <select
                        name="frameSize"
                        value={form.frameSize}
                        onChange={handleChange}
                        className="bg-transparent border-none p-0 focus:ring-0 text-right font-headline font-bold text-on-surface appearance-none"
                      >
                        {['52 cm', '54 cm', '56 cm', '58 cm'].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 03: Media Assets */}
          <section id="media">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">03</span>
                <h2 className="font-headline font-bold uppercase text-xs tracking-widest text-primary">Media Assets</h2>
              </div>
              <div className="md:w-3/4">
                <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px]">
                  {/* Primary upload slot */}
                  <div
                    className="col-span-2 row-span-2 bg-surface-container-high rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant group cursor-pointer hover:bg-surface-container-highest transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="material-symbols-outlined text-4xl text-primary mb-4">add_a_photo</span>
                    <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">Upload Primary Hero</span>
                    <span className="text-[10px] text-on-surface-variant mt-1 font-body">Recommend 4000x3000px</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>

                  {/* Uploaded images */}
                  {images.slice(0, 2).map((src, idx) => (
                    <div key={idx} className="bg-surface-container-high rounded-xl overflow-hidden relative group">
                      <img
                        src={src}
                        alt={`bike detail ${idx + 1}`}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/20 backdrop-blur-sm transition-opacity cursor-pointer"
                        onClick={() => removeImage(idx)}
                      >
                        <span className="material-symbols-outlined text-on-primary">delete</span>
                      </div>
                    </div>
                  ))}

                  {/* Empty slots */}
                  {Array.from({ length: Math.max(0, 2 - images.length) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="bg-surface-container-high rounded-xl overflow-hidden relative group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-outline-variant/40">
                        <span className="material-symbols-outlined text-outline">add</span>
                      </div>
                    </div>
                  ))}

                  {/* Always show 2 add slots at the end */}
                  {images.length >= 2 && (
                    <>
                      <div
                        className="bg-surface-container-high rounded-xl overflow-hidden relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-outline-variant/40">
                          <span className="material-symbols-outlined text-outline">add</span>
                        </div>
                      </div>
                      <div
                        className="bg-surface-container-high rounded-xl overflow-hidden relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-outline-variant/40">
                          <span className="material-symbols-outlined text-outline">add</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: Provenance */}
          <section id="details">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">04</span>
                <h2 className="font-headline font-bold uppercase text-xs tracking-widest text-primary">Provenance</h2>
              </div>
              <div className="md:w-3/4 space-y-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4 font-body">
                    Current Condition
                  </label>
                  <div className="flex gap-4 flex-wrap">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCondition(c)}
                        className={`px-6 py-3 font-headline font-bold text-xs uppercase rounded-full transition-colors ${
                          condition === c
                            ? 'bg-surface-container-highest border border-primary text-primary'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Detailed Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-6 py-6 focus:ring-2 focus:ring-primary-container font-body leading-relaxed rounded"
                    placeholder="Describe the ride characteristics, history of maintenance, and any upgrades..."
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                      Usage History (KM)
                    </label>
                    <input
                      name="usageKm"
                      value={form.usageKm}
                      onChange={handleChange}
                      className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body rounded"
                      placeholder="~1,500 km"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                      Last Service Date
                    </label>
                    <input
                      name="lastService"
                      value={form.lastService}
                      onChange={handleChange}
                      className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body rounded"
                      type="date"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 05: Trust Program */}
          <section id="inspection">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">05</span>
                <h2 className="font-headline font-bold uppercase text-xs tracking-widest text-primary">Trust Program</h2>
              </div>
              <div className="md:w-3/4">
                <div className="bg-secondary-container p-1 rounded-xl">
                  <div className="bg-surface-container-lowest p-8 rounded-lg flex items-center justify-between gap-8">
                    <div className="flex gap-6 items-start">
                      <div className="bg-secondary text-on-secondary p-4 rounded-full">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                          verified_user
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-headline font-bold text-xl text-on-secondary-container">Pro-Tour Inspection</h3>
                          <span className="px-2 py-0.5 bg-secondary text-on-secondary text-[8px] font-bold uppercase rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant font-body leading-relaxed max-w-lg">
                          List with absolute authority. Our mechanics will perform a 50-point technical check and certify
                          your listing. Increases sale speed by 40% on average.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-headline font-bold text-xl text-secondary">$149.00</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={inspectionEnabled}
                        onClick={() => setInspectionEnabled((v) => !v)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                          inspectionEnabled ? 'bg-secondary' : 'bg-outline-variant'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            inspectionEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <footer className="pt-12 border-t border-outline-variant/10 flex justify-between items-center">
            <button
              type="button"
              className="flex items-center gap-2 font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Discard Draft
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                className="px-10 py-5 bg-surface-container-highest text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-12 py-5 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-[0.2em] rounded-lg shadow-[0_20px_40px_rgba(168,49,0,0.25)] hover:bg-primary-dim transition-all active:scale-95"
              >
                Publish Listing
              </button>
            </div>
          </footer>
        </form>
      </main>

      {/* Background editorial decoration */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full overflow-hidden opacity-5 pointer-events-none">
        <span className="absolute top-1/4 -right-20 text-[20rem] font-headline font-black text-primary leading-none rotate-90 select-none">
          VELOCE
        </span>
      </div>
    </div>
  );
}

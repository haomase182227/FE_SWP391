import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerSidebar from '../../components/SellerSidebar';
import { useAuth } from '../Context/AuthContext';

const API_BASE = '/api/v1';
export default function NewListing() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const token = currentUser?.token;

  // ── Lookup data ───────────────────────────────────────────────
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API_BASE}/seller/Listings/lookups/categories`, { headers })
      .then(r => r.ok ? r.json() : [])
      .then(c => setCategories(Array.isArray(c) ? c : (c.data ?? c.items ?? [])))
      .catch(() => {});
  }, [token]);

  // ── Form state ────────────────────────────────────────────────
  const [condition,         setCondition]         = useState('Pristine');
  const [inspectionEnabled, setInspectionEnabled] = useState(true);
  const [primaryImageFile,  setPrimaryImageFile]  = useState(null);
  const [additionalFiles,   setAdditionalFiles]   = useState([]);
  const [previewImages,     setPreviewImages]      = useState([]);
  const [form, setForm] = useState({
    title:         '',
    brandName:     '',
    modelName:     '',
    categoryId:    '',
    categorySlug:  '',
    year:          '',
    price:         '',
    frameSize:     '',
    description:   '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError,   setSubmitError]   = useState('');

  const fileInputRef    = useRef(null);
  const primaryInputRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    const categorySlug = e.target.value;
    const selectedCategory = categories.find(
      (c) => c.categorySlug === categorySlug || c.slug === categorySlug
    );

    setForm((prev) => ({
      ...prev,
      categorySlug,
      categoryId: selectedCategory?.categoryId
        ? String(selectedCategory.categoryId)
        : selectedCategory?.id
          ? String(selectedCategory.id)
          : '',
    }));
  };

  // ── Image handlers ────────────────────────────────────────────
  const handlePrimaryUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPrimaryImageFile(file);
    setPreviewImages((prev) => {
      const next = [...prev];
      next[0] = url;
      return next;
    });
  };

  const handleAdditionalUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    setAdditionalFiles((prev) => [...prev, ...files]);
    setPreviewImages((prev) => [...prev, ...urls]);
  };

  const removeImage = (idx) => {
    if (idx === 0) {
      setPrimaryImageFile(null);
    } else {
      setAdditionalFiles((prev) => prev.filter((_, i) => i !== idx - 1));
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');
    try {
      const fd = new FormData();

      // Required
      fd.append('Title', form.title);
      fd.append('RequestInspection', String(inspectionEnabled));

      // Integer fields — only append if valid number
      if (form.categoryId && !isNaN(form.categoryId)) fd.append('CategoryId', parseInt(form.categoryId, 10));

      // String fields — brand & model as names
      if (form.brandName) fd.append('BrandName', form.brandName);
      if (form.modelName) fd.append('ModelName', form.modelName);
      if (form.year       && !isNaN(form.year))       fd.append('Year',       parseInt(form.year, 10));

      // Double fields
      if (form.price  && !isNaN(form.price))  fd.append('Price',  parseFloat(form.price));

      // String fields
      if (form.frameSize)     fd.append('FrameSize',     form.frameSize);
      if (form.description)   fd.append('Description',   form.description);

      // Files
      const allImages = [primaryImageFile, ...additionalFiles].filter(Boolean);
      if (allImages.length > 0) {
        fd.append('PrimaryImage', allImages[0]);
        allImages.slice(1).forEach((f) => fd.append('AdditionalImages', f));
      }

      const res = await fetch(`${API_BASE}/seller/Listings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const d = await res.json().catch(async () => ({ raw: await res.text().catch(() => '') }));
        const validationErrors = d.errors
          ? Object.entries(d.errors).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join(' | ')
          : '';
        const fallbackMessage = d.detail || d.message || d.title || d.raw || `HTTP ${res.status}`;
        throw new Error(validationErrors ? `${fallbackMessage} (${validationErrors})` : fallbackMessage);
      }
      navigate('/seller/listings');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <SellerSidebar
        brandName="Pro-Tour Seller"
        avatarSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBqbF9iNTv0bf12Xf_6OXCV8ABGhUJ13qL3Skz87MXP9Z_Gg_67pryu_bzTsFeYh5zumD-CWuZuYJCr7cz4m6fab0MRt3mUYxHZgs3-frNGSKKv-ymzNlmNDz_rmK5q--8c7V7z3q_7Y6197v12Q39EdH8tpFH93Bvt6JtO2mDROzGAW3sQwYdQz-Rj6q9piqEIUN9j9WSrQxVkg2a2UQYDzK2Zq4QVowKJQCOjP-Rj3FhqIeOuAG4bVxx6CLCH_8rFQAucJZXGuQvG"
        merchantName="Verified Merchant"
        merchantSub="Seller Dashboard"
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
                  <input
                    name="brandName"
                    value={form.brandName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body text-on-surface placeholder-on-surface-variant/40 rounded"
                    placeholder="e.g. Specialized"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Model</label>
                  <input
                    name="modelName"
                    value={form.modelName}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body placeholder-on-surface-variant/40 rounded"
                    placeholder="e.g. Tarmac SL7"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Category</label>
                  <select
                    name="categorySlug"
                    value={form.categorySlug}
                    onChange={handleCategoryChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body rounded"
                  >
                    <option value="">— Select Category —</option>
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categorySlug}>{c.categoryName}</option>
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
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Price (VND)</label>
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-headline font-bold text-primary rounded"
                      placeholder="12500"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 font-body">Frame Size</label>
                  <input
                    name="frameSize"
                    value={form.frameSize}
                    onChange={handleChange}
                    className="w-full bg-surface-container-high border-none px-4 py-4 focus:ring-2 focus:ring-primary-container font-body placeholder-on-surface-variant/40 rounded"
                    placeholder="e.g. 54 cm"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Media Assets */}
          <section id="media">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">02</span>
                <h2 className="font-headline font-bold uppercase text-xs tracking-widest text-primary">Media Assets</h2>
              </div>
              <div className="md:w-3/4">
                <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px]">
                  {/* Primary upload slot */}
                  <div
                    className="col-span-2 row-span-2 bg-surface-container-high rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-outline-variant group cursor-pointer hover:bg-surface-container-highest transition-colors relative overflow-hidden"
                    onClick={() => primaryInputRef.current?.click()}
                  >
                    {previewImages[0] ? (
                      <>
                        <img src={previewImages[0]} alt="primary" className="w-full h-full object-cover" />
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/20 backdrop-blur-sm transition-opacity cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); removeImage(0); }}
                        >
                          <span className="material-symbols-outlined text-white text-3xl">delete</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-4xl text-primary mb-4">add_a_photo</span>
                        <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">Upload Primary Hero</span>
                        <span className="text-[10px] text-on-surface-variant mt-1 font-body">Recommend 4000x3000px</span>
                      </>
                    )}
                    <input
                      ref={primaryInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePrimaryUpload}
                    />
                  </div>

                  {/* Additional images (slots 1-4) */}
                  {[0, 1, 2, 3].map((slotIdx) => {
                    const imgSrc = previewImages[slotIdx + 1];
                    return imgSrc ? (
                      <div key={slotIdx} className="bg-surface-container-high rounded-xl overflow-hidden relative group">
                        <img
                          src={imgSrc}
                          alt={`bike detail ${slotIdx + 1}`}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/20 backdrop-blur-sm transition-opacity cursor-pointer"
                          onClick={() => removeImage(slotIdx + 1)}
                        >
                          <span className="material-symbols-outlined text-white">delete</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={slotIdx}
                        className="bg-surface-container-high rounded-xl overflow-hidden relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-outline-variant/40">
                          <span className="material-symbols-outlined text-outline">add</span>
                        </div>
                      </div>
                    );
                  })}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleAdditionalUpload}
                  />
                  {/* keep an explicit file input for the primary hero so browsers allow selecting one file reliably */}
                </div>
              </div>
            </div>
          </section>

          {/* Section 03: Provenance */}
          <section id="details">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">03</span>
                <h2 className="font-headline font-bold uppercase text-xs tracking-widest text-primary">Provenance</h2>
              </div>
              <div className="md:w-3/4 space-y-8">
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
              </div>
            </div>
          </section>

          {/* Section 04: Trust Program */}
          <section id="inspection">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-1/4">
                <span className="block font-headline font-bold text-3xl text-on-surface tracking-tight mb-2">04</span>
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
                      <span className="font-headline font-bold text-xl text-secondary">200.000đ</span>
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
              onClick={() => navigate('/seller/listings')}
              className="flex items-center gap-2 font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Discard Draft
            </button>
            <div className="flex flex-col items-end gap-2">
              {submitError && <p className="text-error text-xs font-bold">{submitError}</p>}
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-10 py-5 bg-surface-container-highest text-on-surface font-headline font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-surface-container-low transition-colors"
                  disabled={submitLoading}
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-12 py-5 bg-primary text-on-primary font-headline font-bold text-xs uppercase tracking-[0.2em] rounded-lg shadow-[0_20px_40px_rgba(168,49,0,0.25)] hover:bg-primary-dim transition-all active:scale-95 disabled:opacity-60"
                >
                  {submitLoading ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
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

import React from 'react';

const UserManagement = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen">
      {/* SideNavBar Shell */}
      <aside
        className="fixed left-0 h-full w-64 z-50 bg-zinc-50 dark:bg-zinc-950 flex flex-col py-8 px-4 border-r border-zinc-200/20"
        style={{ background: 'linear-gradient(to bottom, #fff4f3 0%, #ffedeb 100%)' }}
      >
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-on-primary">bolt</span>
            </div>
            <div>
              <h1 className="font-headline text-2xl font-black italic text-orange-700 dark:text-orange-500 leading-tight">
                Kinetic Admin
              </h1>
              <p className="font-label uppercase tracking-widest text-[10px] text-zinc-500">
                Precision Velocity
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-transform duration-300 hover:translate-x-1 group"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label uppercase tracking-widest text-[10px]">
              Dashboard
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 font-bold border-r-4 border-orange-700 transition-transform duration-300 hover:translate-x-1 group"
            href="#"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-label uppercase tracking-widest text-[10px]">
              User Management
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-transform duration-300 hover:translate-x-1 group"
            href="#"
          >
            <span className="material-symbols-outlined">rule</span>
            <span className="font-label uppercase tracking-widest text-[10px]">
              Listing Moderation
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-transform duration-300 hover:translate-x-1 group"
            href="#"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-label uppercase tracking-widest text-[10px]">
              Transactions
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-transform duration-300 hover:translate-x-1 group"
            href="#"
          >
            <span className="material-symbols-outlined">engineering</span>
            <span className="font-label uppercase tracking-widest text-[10px]">
              Inspectors
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-transform duration-300 hover:translate-x-1 group"
            href="#"
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-label uppercase tracking-widest text-[10px]">
              Reports
            </span>
          </a>
        </nav>
        <div className="mt-auto space-y-4 pt-6 border-t border-zinc-200/20">
          <button className="w-full bg-primary py-3 rounded-lg text-on-primary font-label font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            Export Global Data
          </button>
          <div className="space-y-1">
            <a
              className="flex items-center gap-3 px-4 py-2 text-zinc-600 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">contact_support</span>
              <span className="font-label uppercase tracking-widest text-[10px]">
                Support
              </span>
            </a>
            <a
              className="flex items-center gap-3 px-4 py-2 text-zinc-600 hover:text-error transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="font-label uppercase tracking-widest text-[10px]">
                Sign Out
              </span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="pl-64 min-h-screen">
        {/* TopNavBar Shell */}
        <header className="fixed top-0 right-0 left-64 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-40 flex justify-between items-center px-8 shadow-[0_20px_40px_rgba(78,33,32,0.06)] border-b border-white/10">
          <div className="flex items-center gap-8">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-400 text-lg">
                search
              </span>
              <input
                className="bg-zinc-100 border-none rounded-full pl-10 pr-4 py-2 text-sm w-80 focus:ring-2 focus:ring-primary/20 transition-all font-body text-on-surface"
                placeholder="Search across users, transactions, or logs..."
                type="text"
              />
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a
                className="text-orange-700 dark:text-orange-500 font-bold border-b-2 border-orange-700 text-sm py-5 px-1 font-['Inter'] tracking-tight transition-colors"
                href="#"
              >
                Dashboard
              </a>
              <a
                className="text-zinc-500 dark:text-zinc-400 font-medium text-sm py-5 px-1 font-['Inter'] tracking-tight hover:text-orange-600 transition-colors"
                href="#"
              >
                Logs
              </a>
              <a
                className="text-zinc-500 dark:text-zinc-400 font-medium text-sm py-5 px-1 font-['Inter'] tracking-tight hover:text-orange-600 transition-colors"
                href="#"
              >
                Settings
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="h-8 w-px bg-zinc-200 mx-2"></div>
            <img
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
              data-alt="Close-up portrait of a professional male administrator in his 40s with a clean-shaven look and smart casual attire, neutral background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeoOEekGUQFnac5mATDxElJfZ0nS4qAjyvZaWRixTqFcme2trFTf6GMJmSys8DY8TjanyyONOmN86xV2G4I6DgIADP-OVni8Ja5n7w7nEjf1ysSyHuhV9OOzmVfDd0QMUvnmkHIU9GR5Mx_vkUQmozUg0o1OV_5oVEBhte7vgK_F63Yfm8AjxksMH2YpD61EtwxiwVOWZ6yokpZOIaYGwToFsoNM-hXWmRM90gOThesHrNvHxKPbh_kRbu8dq2nUD9rH64GX0TWQlt"
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="mt-16 p-10 space-y-8">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-headline text-4xl font-black text-on-surface tracking-tighter uppercase mb-2">
                User Directory
              </h2>
              <p className="text-on-surface-variant font-body">
                Manage permissions, moderate accounts, and review platform activity.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                All Roles
                <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
              </button>
              <button className="px-6 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-sm">sort</span>
                Latest First
              </button>
            </div>
          </div>

          {/* Bento Grid Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] group hover:scale-[1.02] transition-transform">
              <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant mb-1">
                Total Users
              </p>
              <h3 className="font-headline text-3xl font-bold text-primary">12,482</h3>
              <div className="mt-4 flex items-center gap-1 text-tertiary font-bold text-xs">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +14.2%
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] group hover:scale-[1.02] transition-transform">
              <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant mb-1">
                Active Sellers
              </p>
              <h3 className="font-headline text-3xl font-bold text-secondary">3,105</h3>
              <div className="mt-4 flex items-center gap-1 text-tertiary font-bold text-xs">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Live Now
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] group hover:scale-[1.02] transition-transform">
              <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant mb-1">
                Pending Verification
              </p>
              <h3 className="font-headline text-3xl font-bold text-orange-500">142</h3>
              <div className="mt-4 flex items-center gap-1 text-error font-bold text-xs">
                <span className="material-symbols-outlined text-sm">priority_high</span>
                Action Required
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)] group hover:scale-[1.02] transition-transform">
              <p className="font-label uppercase text-[10px] tracking-widest text-on-surface-variant mb-1">
                Banned Accounts
              </p>
              <h3 className="font-headline text-3xl font-bold text-zinc-900">28</h3>
              <div className="mt-4 flex items-center gap-1 text-zinc-500 font-bold text-xs">
                <span className="material-symbols-outlined text-sm">block</span>
                Restricted Access
              </div>
            </div>
          </div>

          {/* Main Table / List View */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-white shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                      User Profile
                    </th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                      Role &amp; Status
                    </th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                      Volume (GMV)
                    </th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant">
                      Last Active
                    </th>
                    <th className="px-8 py-5 font-label uppercase text-[10px] tracking-widest text-on-surface-variant text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {/* User Row 1 */}
                  <tr className="hover:bg-primary-container/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            alt="User Avatar"
                            className="w-12 h-12 rounded-full object-cover"
                            data-alt="Portrait of a woman with a confident expression, professional lighting, urban office background"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK1zIdpPpdRHyWFxrpQ58LTDYn6ETKE6g8udI-Ttb921XuK7xTRtjOYnx6FXgD-QgfnnUEDdPM-I-kcMaUSruj9ljzt2l1s5JY81_ucYdQYj1aVPJdvsZ_ibIgsEcZZT4XOBYIu8nkaJwC_wS705c60v9qRy-2F43sajxdYKT9vkkn86183GnK3vVRwNGuzdZeyNpfL9XjgN-tXRr-UEzzpVNG3LEw-0Qtki0lDXpVDpm4iJrwKcT-aTZsYBIrmQu80bxCRI3JQFdu"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-tertiary border-2 border-white rounded-full flex items-center justify-center">
                            <span
                              className="material-symbols-outlined text-[10px] text-white"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-headline text-sm font-bold text-on-surface">
                            Elena Rodriguez
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            elena.r@veloceshop.com
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-tighter">
                          Verified Seller
                        </span>
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-tighter">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-headline text-base font-bold text-on-surface">
                        $14,250.00
                      </p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        12 Transactions
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-on-surface">2 mins ago</p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        IP: 192.168.1.1
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">
                            edit
                          </span>
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error-container/10 transition-colors"
                          title="Ban"
                        >
                          <span className="material-symbols-outlined text-error text-lg">
                            block
                          </span>
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
                          title="Settings"
                        >
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">
                            more_vert
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* User Row 2 */}
                  <tr className="hover:bg-primary-container/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-headline font-bold">
                          MT
                        </div>
                        <div>
                          <p className="font-headline text-sm font-bold text-on-surface">
                            Marcus Thorne
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            m.thorne@accounting.io
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-tighter">
                          Accountant
                        </span>
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold uppercase tracking-tighter">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-headline text-base font-bold text-on-surface">
                        N/A
                      </p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        Internal Access
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-on-surface">45 mins ago</p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        London, UK
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">
                            edit
                          </span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error-container/10 transition-colors">
                          <span className="material-symbols-outlined text-error text-lg">
                            block
                          </span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">
                            more_vert
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* User Row 3 */}
                  <tr className="hover:bg-primary-container/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full object-cover"
                          data-alt="Close-up headshot of a creative male designer with glasses, bright studio lighting, soft colorful background"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHi053ltk9JklHUP51RoSYSUSkp9JsYnjQcKNTPL5EG3xTv6pLirvtfmCBu3ufKS7Z5Bg8lGLDs5_JdiyofmFx-P6hOli4B2w263BN1NbvuvKglFOXawNEw21hk3aSgfVKep4b74wcrLB-C9iRw26UYpFGtxjs3Y0Jgo7Y0BbMavtdDq30j7MV6VEaajqOHqEa0NDIT0S-jOad3mj-A1Yw8V6UqHaHy3soAu-tkTZfOD9hsWImzN2sV5oP-SYAvkz2SPA-j3H-BISl"
                        />
                        <div>
                          <p className="font-headline text-sm font-bold text-on-surface">
                            Julian Weber
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            weber.bikes@web.de
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">
                          Buyer
                        </span>
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 text-[10px] font-bold uppercase tracking-tighter">
                          Pending
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-headline text-base font-bold text-on-surface">
                        $2,890.00
                      </p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        1 Transaction
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-on-surface">Yesterday</p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        Berlin, DE
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-4 py-1.5 bg-primary rounded-lg text-on-primary font-label font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
                          Verify
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">
                            more_vert
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* User Row 4 */}
                  <tr className="hover:bg-primary-container/5 transition-colors group opacity-60 grayscale">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img
                          alt="User Avatar"
                          className="w-12 h-12 rounded-full object-cover"
                          data-alt="Portrait of a male professional looking slightly off-camera, warm sunset light, outdoor setting"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaC2nwvFxPb--Q7XdRqoD72E3AMyjIv0wsuf4C6I_EUyVx7fE0CzW1cpF8331FT0QgGlyaT12deey-ioVkQFjOmapPFacSS7a2LTnDx3F2uekTNx8z3dxrz_BH5ivrPi1P10BjzH4n7rZia4eGCov1wtn6Xj4dScPOzDdAGHYzuS7BWJl9kGp9cOpvG-Z_-6O3Fs6hmTZUJpagSoyF8szgUChjBQO9ydQbQbgtwOtICAWSBhI_1XQMhBiuDfhITlN2cKqDuXGHpP6s"
                        />
                        <div>
                          <p className="font-headline text-sm font-bold text-on-surface line-through">
                            Thomas Kael
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            thomas.k@gmail.com
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-tighter">
                          Seller
                        </span>
                        <span className="inline-flex items-center self-start px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-tighter">
                          Banned
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-headline text-base font-bold text-on-surface">
                        $0.00
                      </p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        Flagged Account
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-on-surface">3 weeks ago</p>
                      <p className="text-[10px] font-label text-zinc-400 uppercase tracking-widest">
                        Fraud Detection
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-4 py-1.5 border border-outline-variant/20 rounded-lg text-on-surface font-label font-bold uppercase text-[10px] tracking-widest hover:bg-surface-container-high transition-colors">
                          Unban
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">
                            more_vert
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-5 border-t border-surface-container-low flex items-center justify-between">
              <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">
                Showing 1-10 of 12,482 users
              </p>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  disabled
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold text-xs">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors font-bold text-xs">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors font-bold text-xs">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors font-bold text-xs">
                  1,248
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
              <h4 className="font-headline text-lg font-bold text-primary mb-4 uppercase tracking-tighter">
                Platform Integrity Notice
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Automated fraud detection is currently monitoring all high-value transactions. Manual verification is required for all new sellers exceeding $5,000 in monthly volume.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    data-alt="Portrait of woman"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtFdoko9W5ijz706QaMD76K-C0jhtBD0WSROCA8s2Nlg4p-y9IkqW3AqYVuTTyHbouX-XTdIDhX0SOHGyxHyO0C4SeFeVLo2xYGNR1qaDsXRkXEtlixBO7-XOBj7h87cqGVdlnPl135TkNCl0Fet9Et3KmdtBoSr90wpOo8tbrr0Lm-bstG4y712pP1dM1vxmWR6q8B5OhrdzN3gTgv0_yS1K78eyhuN-CHl-SGtfVyeSk7KiMU151G1c2TlZIyUhTs24TXhomMyxU"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    data-alt="Portrait of man"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPV5YwqAXyDaGH1yzBcDH8Q86dRnWrxPxKPuX9wHCJsG0q3mnk_Y1aHh3ylil0M6pU2geTjwBBu-3T67UJUBNmlw0yK9nNWDOb5UfNW3vwahmXmkOZFxK9jBz880rXBuu0p7aTKkfYb4RJiOh79n1DdG8EMwOpd7Bhv6a3EzdyN2ZmVAY5j_B3MVzBirUU18pQHknjZLPi98yQhKpha28MRBbX660ZSlauN3lmj-r-ljU3iOydl7AM3xyMxkcK46-pyQocTFXKB-nO"
                  />
                  <div className="w-8 h-8 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                    +4
                  </div>
                </div>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                  Active Moderators Online
                </p>
              </div>
            </div>
            <div className="bg-surface-container-low p-8 rounded-2xl border border-white">
              <h4 className="font-headline text-lg font-bold text-on-surface mb-4 uppercase tracking-tighter">
                Recent System Logs
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="font-bold">Access Denied:</span>
                  <span className="text-on-surface-variant">
                    Failed login attempt from unauthorized IP (Shanghai, CN)
                  </span>
                </li>
                <li className="flex items-center gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="font-bold">User Verified:</span>
                  <span className="text-on-surface-variant">
                    Manual audit completed for 'RoadRider_99'
                  </span>
                </li>
                <li className="flex items-center gap-3 text-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-bold">Role Update:</span>
                  <span className="text-on-surface-variant">
                    Julian Weber changed from 'Guest' to 'Pending Buyer'
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;

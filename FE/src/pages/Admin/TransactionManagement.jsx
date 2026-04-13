import AdminSidebar from '../../components/AdminSidebar';
import AdminTopBar from '../../components/AdminTopBar';

const TransactionManagement = () => {
  return (
    <div className="bg-[#fff4f3] font-body text-on-surface min-h-screen antialiased">
      <AdminSidebar />
      <AdminTopBar title="Transactions" searchPlaceholder="Search Transaction ID, User, or Item..." />

      {/* Main Content */}
      <main className="ml-64 pt-24 px-8 pb-12">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
              Total Escrow Volume
            </p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">
              $142,850.00
            </h3>
            <div className="mt-4 flex items-center text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              <span className="text-[11px] font-bold">+12.5% vs last month</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
              Service Fees (MTD)
            </p>
            <h3 className="text-3xl font-black text-primary tracking-tighter">
              $8,412.20
            </h3>
            <div className="mt-4 flex items-center text-tertiary">
              <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
              <span className="text-[11px] font-bold">Target reached</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
              Active Escrows
            </p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">42</h3>
            <div className="mt-4 flex items-center text-secondary">
              <span className="material-symbols-outlined text-sm mr-1">schedule</span>
              <span className="text-[11px] font-bold">12 pending release</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border-none transition-transform hover:-translate-y-1 duration-300">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
              Refund Rate
            </p>
            <h3 className="text-3xl font-black text-on-surface tracking-tighter">
              0.8%
            </h3>
            <div className="mt-4 flex items-center text-error">
              <span className="material-symbols-outlined text-sm mr-1">warning</span>
              <span className="text-[11px] font-bold">Critical range &lt;1%</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6 bg-surface-container-low p-4 rounded-xl">
          <div className="flex gap-3">
            <button className="bg-primary text-on-primary px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest">
              All Ledgers
            </button>
            <button className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container/20 transition-colors">
              Escrow
            </button>
            <button className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container/20 transition-colors">
              VNPAY Top-up
            </button>
            <button className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-container/20 transition-colors">
              Withdrawals
            </button>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined text-sm text-zinc-400">
                calendar_today
              </span>
              <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
                Last 30 Days
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-lg cursor-pointer">
              <span className="material-symbols-outlined text-sm text-zinc-400">
                filter_list
              </span>
              <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
                Filters
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(78,33,32,0.06)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/50 border-none">
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  ID / Date
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Type &amp; Entity
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                  Participants
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">
                  Gross Amount
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">
                  Fee
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/50">
              {/* Row 1 */}
              <tr className="hover:bg-primary-container/5 transition-colors group">
                <td className="py-5 px-6">
                  <p className="font-headline font-bold text-on-surface tracking-tighter">
                    #TXN-88219
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Oct 24, 2023 • 14:22</p>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        pedal_bike
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Cervélo S5 Aero</p>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                        Escrow
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img
                        className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover"
                        data-alt="close up headshot of a smiling man with glasses in a professional white studio setting"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCejKHk2lZOfjidTRpC2J7pkLqXutyX0PTTt50wmu0vZNJDpQhD1z3gVBeviyiTLZMV8LGkglDdPVs14WDvfVFXFk0cN7kOkOJhtylgPW8oyAbbX_Xbd7LAuIUXIPxK6W01vdRtb2WoeToAmy2kpCl3dz5ka3Z11zSYlpATABTfAx4t4wEggll1ayfYUlM8tWEvougZ6D038InU_ToO4KRrMt0hr9UVlSYSuNeB8E2Jr7jK0RUtxYmJGkexgVgtBym96AW0cBILU1jm"
                        title="Buyer: Julian M."
                      />
                      <img
                        className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover"
                        data-alt="portrait of a young woman with curly hair smiling warmly in natural outdoor lighting with soft foliage background"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1S1_i2Gr12MG71EUS17fHAoVSE9exzhz9W0ZMKXu3VlrzELIblmPhamNPr-CQPeHxyhm4ZVWhX9HJONTdo1JQvfOrQUay0bpANFQ0hl1aVTeutP0PctYF7LrrprZuOjaJ8Jrc9K3X6PphOgBnpG-zcPSBr2h7mk7B5pWQIFDGco4metCQfy7bMDYVCTd3x2DbwMIe_bWs5aHsjCjHL0z_WkXb9BHnwOntqVgReLAQp2UNdyztBPvv3U1OB0VqlYsAXLzMGm7vsSmj"
                        title="Seller: Sarah K."
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <a className="text-[11px] font-semibold text-primary hover:underline" href="#">
                        Julian M. (Buyer)
                      </a>
                      <a className="text-[11px] font-semibold text-on-surface/60 hover:underline" href="#">
                        Sarah K. (Seller)
                      </a>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-on-surface">
                  $12,400.00
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-primary">
                  $372.00
                </td>
                <td className="py-5 px-6">
                  <div className="flex justify-center">
                    <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                      Escrow
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <button className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors">
                    more_vert
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-primary-container/5 transition-colors group">
                <td className="py-5 px-6">
                  <p className="font-headline font-bold text-on-surface tracking-tighter">
                    #TXN-88215
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Oct 24, 2023 • 12:05</p>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-zinc-400">
                        account_balance_wallet
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">VNPAY Top-up</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        Wallet
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover"
                      data-alt="close up face of a woman with freckles looking directly at the camera with a neutral expression in soft daylight"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsXbjWV9REPcbsLRDokF6Ra8A8V2Ln6bI_NQbJxBCgsaqIPKByzAkeHPqa4lkUFA-v4JRXSiIh-svKZE8svHiqgiEj3siClxPfi6rEZb4FyYvXcy_5meKw7tY6ODFC7T9MLWW-Of4njckXWezojvgV3Z1O2nHYULr1BN4Vs_HXgKEvoDtD7WeQd_X8i_KsJSYGtbCKAN7_PIBsYkYiw2ME_qIeMHToG2DoeE6Q2ZOwCGMfQkU1BibUVODJdTFngMv5sY-yrr1b9IEp"
                    />
                    <a className="text-[11px] font-semibold text-on-surface hover:underline" href="#">
                      Elena Vance
                    </a>
                  </div>
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-on-surface">
                  $2,500.00
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-zinc-300">
                  $0.00
                </td>
                <td className="py-5 px-6">
                  <div className="flex justify-center">
                    <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                      Released
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <button className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors">
                    more_vert
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-primary-container/5 transition-colors group">
                <td className="py-5 px-6">
                  <p className="font-headline font-bold text-on-surface tracking-tighter">
                    #TXN-88210
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Oct 23, 2023 • 18:45</p>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">
                        pedal_bike
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        Specialized Tarmac SL7
                      </p>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                        Escrow
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <img
                        className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover"
                        data-alt="headshot of a smiling man with short hair and a beard in a bright outdoor environment"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMwB5s9HVj29HWupHSDkE2k_NSP-DQ9K5iHTAW6M463xIfooW7VWwzdUkHMqr95reqAcnIG8dTx4auG5Nbj9Cf1PUtPgxi-529WDLDfPIQMsL_MAN27il9S2ydzDBkUw55ajGWLaDhfyqYP7kf0sRi8vE7GMIMJ3fBbgCeKbeVoc0_FSS4ESh96Vd33tnt9pGOTeZ2wdNUNS2cv5WlmbgAts6Wr5rhUlnNbivTLE1xeyD8WWTQppGU0KLAisPjZKAyfkwH0fvM8Qa3"
                      />
                      <img
                        className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover"
                        data-alt="minimalist portrait of a man in a black turtleneck against a solid beige background"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4zTyT377kmE-rqKDxkyGGrBG32hg70FJ7vAERi-gx8ycT0d2D3eocJC9wm5G8rN8DYnQjqfo3Tu9ZdhanfcNS_AnecSxktARYKDOZt1ky0Tm5yV3DzKDi-O3suz2ZFUS3wZOZI8yBIqKvMw3GOlPNyiW7qOMYIdfAY45o65vq7zUSz7UPmgiwPsypagvOivDZOD4IwPz9zasvIAJjmykdoDzSWDv04WlbeHhgsTuc_4dz9SEC_9GO9LwwxXkj5_50ytCqkQ_GD4Za"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <a className="text-[11px] font-semibold text-primary hover:underline" href="#">
                        Marcus W.
                      </a>
                      <a className="text-[11px] font-semibold text-on-surface/60 hover:underline" href="#">
                        Leon B.
                      </a>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-on-surface">
                  $8,900.00
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-primary">
                  $267.00
                </td>
                <td className="py-5 px-6">
                  <div className="flex justify-center">
                    <span className="bg-error text-on-error px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                      Refunded
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <button className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors">
                    more_vert
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-primary-container/5 transition-colors group">
                <td className="py-5 px-6">
                  <p className="font-headline font-bold text-on-surface tracking-tighter">
                    #TXN-88208
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">Oct 23, 2023 • 16:12</p>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center">
                      <span className="material-symbols-outlined text-zinc-400">
                        outbound
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        Withdrawal to Bank
                      </p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        Payout
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-7 h-7 rounded-full border-2 border-surface-container-lowest object-cover"
                      data-alt="professional woman in a business suit with her arms crossed smiling confidently in a modern office interior"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-IDdC7x-JWBUxZ1nPzxbvlFTqOr5WHnTx3UVrY8z0wxVbl8i06FVrS5Vgf06yozsbZ3YyE4tgLX5AOPhdWa05b0E9ryS_QMnikvNA6KkrNRlRqy9koBM41QnNb7ejeQnYULPQT_-RrWiP9sNH8Rq1OkItKvs5bzbFipu-TUADIsjr1puQ_0lJbp_4Wz56yt5aZlnhQAgkElA6cWRGwVNT9MWyvbsxpyvfK7GT9W_MRCFcYbF4hQb8FUB6aPlPi08tyT9oupJLia4t"
                    />
                    <a className="text-[11px] font-semibold text-on-surface hover:underline" href="#">
                      Sia Chen
                    </a>
                  </div>
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-on-surface">
                  $5,230.00
                </td>
                <td className="py-5 px-6 text-right font-headline font-bold text-zinc-300">
                  $2.00
                </td>
                <td className="py-5 px-6">
                  <div className="flex justify-center">
                    <span className="bg-surface-container-highest text-zinc-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                      Pending
                    </span>
                  </div>
                </td>
                <td className="py-5 px-6 text-right">
                  <button className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors">
                    more_vert
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="p-6 bg-surface-container-high/20 flex items-center justify-between">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              Showing 1-10 of 2,450 results
            </p>
            <div className="flex gap-1">
              <button className="w-8 h-8 rounded bg-surface-container-lowest border border-zinc-100 flex items-center justify-center hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded bg-primary text-on-primary font-bold text-[10px]">
                1
              </button>
              <button className="w-8 h-8 rounded bg-surface-container-lowest border border-zinc-100 font-bold text-[10px] hover:bg-primary/10">
                2
              </button>
              <button className="w-8 h-8 rounded bg-surface-container-lowest border border-zinc-100 font-bold text-[10px] hover:bg-primary/10">
                3
              </button>
              <button className="w-8 h-8 rounded bg-surface-container-lowest border border-zinc-100 flex items-center justify-center hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detail Modal (Visual Only) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-xl font-black uppercase tracking-tight text-on-surface">
              Recent Transaction Log
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-surface-container-low p-4 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-tertiary mt-2"></div>
                <div>
                  <p className="text-xs font-bold">Escrow funds released for #TXN-88215</p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-medium">
                    Automatic system trigger • 2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-surface-container-low p-4 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="text-xs font-bold">New Dispute raised for #TXN-88190</p>
                  <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-medium">
                    Buyer: Michael S. • 1 hour ago
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-high/40 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">security</span>
              <h4 className="text-sm font-black uppercase tracking-widest text-on-surface">
                Audit Health
              </h4>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  <span>Balance Consistency</span>
                  <span className="text-tertiary">100%</span>
                </div>
                <div className="h-1 w-full bg-zinc-200 rounded-full">
                  <div className="h-full w-full bg-tertiary rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-1.5">
                  <span>KYC Verification Rate</span>
                  <span className="text-on-surface">94.2%</span>
                </div>
                <div className="h-1 w-full bg-zinc-200 rounded-full">
                  <div className="h-full w-[94%] bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-3 border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-all">
              Run Full Audit Scan
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Support/Help */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(168,49,0,0.3)] hover:scale-105 active:scale-95 transition-all">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            support_agent
          </span>
        </button>
      </div>
    </div>
  );
};

export default TransactionManagement;

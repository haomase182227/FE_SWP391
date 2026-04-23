const ADMIN_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiPk_Vf9LAwAiW_XX14uOlyG3ee5oXRFH17nspNf-47PqdydBy6R8wwenc4aFA2wU8vVZSwVFfhVsiTF9j_iaEXI60r4PDvTFUbbwjNSc5LGgFq7MjOzTxOPh3eXPA_HEozC-qxRzROPMSC9LaWGxPWwyRDGbkmNSiWvCl5NNGYpYZ8PopqWr5XWxbI8rhJsqpMyBplc4Vn2WZAfNXRBzBNYXmp8arVV6ZI28WbKrwJ8qA90l8mC06dtJWhaSUpg2wjak7OGiilXqc';

export default function AdminTopBar({ title = '' }) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 z-40 bg-white/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(78,33,32,0.06)] flex justify-between items-center px-8">
      <div className="flex items-center gap-6">
        {title && (
          <h1 className="text-base font-headline font-bold tracking-tighter text-primary uppercase whitespace-nowrap">
            {title}
          </h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-zinc-200" />
        <img
          alt="Admin Avatar"
          className="w-9 h-9 rounded-full border border-outline-variant/20 object-cover"
          src={ADMIN_AVATAR}
        />
      </div>
    </header>
  );
}

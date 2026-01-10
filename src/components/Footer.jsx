import ketalogLogo from "../assets/logo/Ketalog_Logo.jpeg";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white">
      <div className="w-full px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <img src={ketalogLogo} alt="Ketalog Logo" className="h-12 w-auto object-contain mb-3 rounded-lg" />
            <p className="mt-3 text-sm text-white/90">
              KETALOG is a B2C platform connecting buyers and sellers with a smooth shopping experience.
            </p>

            <div className="mt-4 flex gap-3 text-xl">
              <a href="#" className="opacity-90 hover:opacity-100">🌐</a>
              <a href="#" className="opacity-90 hover:opacity-100">📸</a>
              <a href="#" className="opacity-90 hover:opacity-100">🐦</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="mt-3 space-y-2 text-sm">
              <a className="block hover:underline" href="/privacy-policy">Privacy Policy</a>
              <a className="block hover:underline" href="/terms">Terms & Conditions</a>
              <a className="block hover:underline" href="/shipping-policy">Shipping Policy</a>
              <a className="block hover:underline" href="/return-policy">Return & Exchange</a>
              <a className="block hover:underline" href="/help">Help / Support</a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">KETALOG</h3>
            <div className="mt-3 space-y-2 text-sm">
              <a className="block hover:underline" href="#">About Ketalog</a>
              <a className="block hover:underline" href="#">Sell on Ketalog</a>
              <a className="block hover:underline" href="#">Ketalog Components</a>
              <a className="block hover:underline" href="#">TSP for Ketalog</a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-black/30 px-6 py-4 text-sm">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <div className="flex items-center gap-6">
            <a className="hover:underline" href="/terms">Terms & condition</a>
            <a className="hover:underline" href="/privacy-policy">Privacy Policy</a>
          </div>
          <div>© KETALOG. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
}
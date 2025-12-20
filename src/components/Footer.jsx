export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">

        <div>
          <h3 className="font-semibold mb-2">B2C Website</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Connecting buyers with trusted sellers across categories.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Explore</h3>
          <ul className="space-y-1 text-gray-600 dark:text-gray-400">
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Grocery</li>
            <li>Daily Needs</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Support</h3>
          <ul className="space-y-1 text-gray-600 dark:text-gray-400">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

      </div>

      <div className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} B2C Website. All rights reserved.
      </div>
    </footer>
  );
}

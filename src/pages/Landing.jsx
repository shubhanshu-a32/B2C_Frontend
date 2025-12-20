import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navbar";
import ImageSlider from "../components/ImageSlider";
import Footer from "../components/Footer";
import useAuthStore from "../store/authStore";
import { CATEGORIES } from "../constants/categories";

export default function MainLanding() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);

  // Redirect logged-in users
  useEffect(() => {
    if (user) {
      navigate(
        user.role === "seller"
          ? "/seller/dashboard"
          : "/buyer/dashboard",
        { replace: true }
      );
    }
  }, [user, navigate]);

  // Always go to Shop page (no query params in URL)
  const openSubCategory = (catId, subId) => {
    navigate("/shop", {
      state: { category: catId, subcategory: subId },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavBar />

      <main className="flex-1 w-full mx-auto px-4 py-6 space-y-10">
        {/* IMAGE SLIDER */}
        <ImageSlider />

        {/* CATEGORY SECTION */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Shop by Category
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <button
                  onClick={() =>
                    setOpenCategory(
                      openCategory === cat.id ? null : cat.id
                    )
                  }
                  className="w-full px-5 py-4 text-left text-lg font-semibold flex justify-between items-center"
                >
                  {cat.title}
                  <span className="text-gray-400">
                    {openCategory === cat.id ? "−" : "+"}
                  </span>
                </button>

                {openCategory === cat.id && (
                  <div className="border-t dark:border-gray-700 px-4 py-3 space-y-2">
                    {cat.subs.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() =>
                          openSubCategory(cat.id, sub.id)
                        }
                        className="block w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import useCartStore from "../../store/cartStore";
import useAuthStore from "../../store/authStore";
import { useLocation } from "../../context/LocationContext";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

// Optimized Shipping Calculation
// Optimized Shipping Calculation
// Optimized Shipping Calculation
const calcShipping = (itemCount, total) => {
  // Free Shipping (User Request)
  return 0;
};

import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQty, placeOrder, loading, deduplicateCart, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("COD");

  useEffect(() => {
    deduplicateCart();
  }, []);

  // Address State
  const { location } = useLocation();
  const [addressSource, setAddressSource] = useState("saved"); // 'saved' | 'current'
  const [userProfile, setUserProfile] = useState(null);
  const [availableLocations, setAvailableLocations] = useState([]); // For Dropdown

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    pincode: ""
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [availableOffers, setAvailableOffers] = useState([]);
  const [appliedOffer, setAppliedOffer] = useState(null);

  // Calculate Totals
  const sellerGroups = {};
  items.forEach(item => {
    const sid = item.sellerId || "unknown";
    if (!sellerGroups[sid]) sellerGroups[sid] = { count: 0, total: 0 };
    sellerGroups[sid].count += 1;
    sellerGroups[sid].total += item.price * item.qty;
  });

  let totalShipping = 0;
  Object.values(sellerGroups).forEach(group => {
    totalShipping += calcShipping(group.count, group.total);
  });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = totalShipping;
  /* Removed duplicate lines */
  const grandTotal = Math.max(0, total + shipping - discount);

  // Load Initial Data (Profile & Locations)
  useEffect(() => {
    // 1. Fetch Locations for Dropdown
    api.get("/location").then(({ data }) => {
      setAvailableLocations(data || []);
    }).catch(err => { /* console.error("Loc fetch failed", err) */ });

    api.get("/admin/offers/active").then(({ data }) => {
      setAvailableOffers(data || []);
    }).catch(err => { /* console.error("Offers fetch failed", err) */ });

    // 2. Fetch Profile
    api.get("/buyer/profile")
      .then(({ data }) => {
        setUserProfile(data);
        // Priority: Saved Profile Data > Current Location
        if (data && (data.address || data.city || data.pincode)) {
          setFormData({
            address: data.address || "",
            city: data.city || "",
            pincode: String(data.pincode || "") // FORCE STRING
          });
          setAddressSource("saved");
        } else if (location) {
          // If no saved, try current
          setFormData({
            address: "",
            city: location.city || location.district || location.area || "", // Try broad, user will correct via dropdown
            pincode: String(location.pincode || "") // FORCE STRING
          });
          setAddressSource("current");
        }
      })
      .catch((err) => { /* console.error("Failed to load addresses", err) */ });
  }, [location]);

  const handleSourceChange = (source) => {
    setAddressSource(source);
    if (source === "current") {
      if (location && location.pincode) {
        // Try to match specific KatniLocation by Pincode
        const matchedLoc = availableLocations.find(l => String(l.pincode) === String(location.pincode));

        setFormData({
          address: "", // Keep empty for user to fill House No
          city: matchedLoc ? matchedLoc.area : (location.area || ""), // Prefer DB match, else detected
          pincode: String(location.pincode)
        });
        toast.success("Location synced with Pincode", { icon: "📍" });
      } else {
        toast.error("Location not detected");
        setFormData({ address: "", city: "", pincode: "" });
      }
    } else if (source === "saved") {
      if (userProfile) {
        setFormData({
          address: userProfile.address || "",
          city: userProfile.city || "",
          pincode: String(userProfile.pincode || "")
        });
      } else {
        setFormData({ address: "", city: "", pincode: "" });
      }
    }
  };

  const handleCityChange = (e) => {
    const selectedArea = e.target.value;

    // Auto-fill pincode if typed/selected city matches a known location
    const matched = availableLocations.find(l => l.area.toLowerCase() === selectedArea.toLowerCase());

    setFormData(prev => ({
      ...prev,
      city: selectedArea,
      pincode: matched ? String(matched.pincode) : ""
    }));
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      // Logic: Backend strictly checks min amount (Cart >= Coupon + 50)
      const res = await api.post("/admin/offer/apply", {
        code: couponCode,
        amount: total, // Use subtotal
        userId: user?._id || "guest",
        products: items.map(i => ({ id: i.productId, qty: i.qty }))
      });

      if (res.data.success) {
        setDiscount(res.data.discountAmount);
        setAppliedOffer({ code: couponCode, ...res.data });
        toast.success(`Coupon applied! Saved ₹${res.data.discountAmount}`);
      }
    } catch (err) {
      // console.error(err);
      const msg = err.response?.data?.message || "Failed to apply coupon";
      toast.error(msg);
      setDiscount(0);
      setAppliedOffer(null);
    }
  };

  const checkout = async () => {
    if (paymentType === "ONLINE") {
      toast.error("Online Order not available right now. Please choose Cash on Delivery.");
      return;
    }

    if (!formData.address || !formData.city || !formData.pincode) {
      toast.error("Please select a location and provide full address");
      return;
    }

    // Safe String Check
    if (String(formData.pincode).trim().length !== 6) {
      toast.error("Invalid Pincode (Must be 6 digits)");
      return;
    }

    // STRICT VALIDATION: Check if pincode exists in database
    const isServiceable = availableLocations.some(
      (loc) => String(loc.pincode) === String(formData.pincode)
    );

    if (!isServiceable) {
      toast.error("Pincode not found / Service not available at this Pincode");
      return; // Block order
    }

    const finalAddress = `${formData.address}, ${formData.city}, ${formData.pincode}`;

    // Auto-save address to profile
    api.put("/buyer/profile", {
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      state: "Madhya Pradesh"
    }).catch(err => { });

    try {
      await placeOrder(paymentType, { fullAddress: finalAddress }, { code: appliedOffer?.code, discount });
      navigate("/buyer/order-success");
    } catch (err) {
      // API errors handled in store
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      toast.success("Cart cleared");
    }
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-8xl">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your cart is empty</h2>
        <Link to="/buyer/shop" className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-xl hover:bg-blue-700 transition shadow-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  // BIG BOX LAYOUT: Maximize width, larger cards.
  return (
    <div className="w-full max-w-[96%] mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Shopping Cart ({items.length})</h2>
        <button
          onClick={handleClearCart}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm font-bold transition"
        >
          <Trash2 size={18} />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Cart Items (Takes up 8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {items.map((it) => (
            <div key={it.productId} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700 flex flex-col md:flex-row gap-6 transition hover:shadow-lg">
              {/* Large Image */}
              <div className="w-full md:w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0 overflow-hidden group">
                <Link to={`/buyer/product/${it.productId}`}>
                  {it.image ? (
                    <img src={it.image} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </Link>
              </div>

              {/* Product Info - Big Text */}
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <Link to={`/buyer/product/${it.productId}`} className="hover:text-blue-600 transition-colors">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 line-clamp-2">{it.title}</h3>
                  </Link>

                  {/* Display Attributes */}
                  {it.attributes && it.attributes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {it.attributes.map(attr => (
                        <span key={attr.name} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-semibold rounded text-gray-600 dark:text-gray-300">
                          {attr.name}: {attr.value}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 text-2xl font-bold text-blue-600">₹{it.price}</div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  {/* Big Qty Controls */}
                  <div className="flex items-center border-2 dark:border-gray-600 rounded-xl overflow-hidden h-12">
                    <button
                      onClick={() => updateQty(it.productId, Math.max(1, it.qty - 1), it.variantId)}
                      className="px-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 h-full text-xl font-bold"
                    >-</button>
                    <div className="w-16 text-center bg-white dark:bg-gray-800 dark:text-white text-lg font-bold flex items-center justify-center h-full border-x-2 dark:border-gray-600">
                      {it.qty}
                    </div>
                    <button
                      onClick={() => updateQty(it.productId, it.qty + 1, it.variantId)}
                      className="px-5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 h-full text-xl font-bold"
                    >+</button>
                  </div>

                  <button
                    onClick={() => removeFromCart(it.productId, it.variantId)}
                    className="text-red-500 hover:text-red-700 px-4 py-2 text-lg font-medium bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Checkout (Takes up 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border dark:border-gray-700 sticky top-6">

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delivery & Billing</h3>

            {/* Address Source Toggles */}
            <div className="flex gap-3 mb-4 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl">
              <button
                onClick={() => handleSourceChange("saved")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${addressSource === "saved"
                  ? "bg-white shadow text-blue-600 dark:bg-gray-600 dark:text-blue-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
              >
                Saved Address
              </button>
              <button
                onClick={() => handleSourceChange("current")}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition${addressSource === "current"
                  ? "bg-white shadow text-green-600 dark:bg-gray-600 dark:text-green-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
              >
                Pincode based Location
              </button>
            </div>

            {/* Address Inputs - Big Inputs */}
            <div className="space-y-4 mb-6">
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full Address (House No, Street, Landmark)..."
                className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 text-base min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              <div className="grid grid-cols-2 gap-3">
                {/* City Dropdown */}
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={handleCityChange}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                  >
                    <option value="">Select Location</option>
                    {availableLocations.map((loc) => (
                      <option key={loc._id} value={loc.area}>
                        {loc.area} ({loc.pincode})
                      </option>
                    ))}
                    {!availableLocations.length && <option disabled>Loading...</option>}
                  </select>
                  <div className="absolute right-3 top-4 pointer-events-none text-gray-500">
                    ▼
                  </div>
                </div>

                <input
                  type="text"
                  value={formData.pincode}
                  readOnly
                  placeholder="Pincode"
                  className="w-full bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl p-3 text-base cursor-not-allowed opacity-70"
                />
              </div>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-600 my-4"></div>


            {/* Coupon Section */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Select a Coupon</h4>
              <div className="flex gap-2">
                <select
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-2 font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">-- Choose available coupon --</option>
                  {availableOffers.map(offer => {
                    // 1. Min Cart Amount Validation
                    const minRequired = offer.minCartAmount || 0;
                    let isEligible = total >= minRequired;
                    let eligibilityMsg = "";

                    if (!isEligible) eligibilityMsg = `[Min Order ₹${minRequired}]`;

                    // Usage limit validation removed

                    return (
                      <option
                        key={offer._id}
                        value={offer.code}
                        disabled={!isEligible}
                      >
                        {offer.code} (Save ₹{offer.conditionValue}) {eligibilityMsg}
                      </option>
                    );
                  })}
                </select>

                <button
                  onClick={applyCoupon}
                  disabled={!couponCode}
                  className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>

              {/* Helper Text for clarity */}
              {availableOffers.length > 0 && !appliedOffer && (
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  * select a coupon from the list above
                </p>
              )}

              {appliedOffer && (
                <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-bold flex justify-between">
                  <span>Applied: {appliedOffer.code}</span>
                  <span>-₹{discount}</span>
                  <button onClick={() => { setDiscount(0); setAppliedOffer(null); setCouponCode(""); }} className="text-red-500 ml-2">❌</button>
                </div>
              )}
            </div>

            <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-600 my-4"></div>

            {/* Totals */}
            {/* Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-base text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-base text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-bold" : ""}>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>

              {/* Discount Row (New) */}
              {discount > 0 && (
                <div className="flex justify-between text-base text-green-600 font-bold">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-2xl font-extrabold text-gray-900 dark:text-white mt-2 pt-2 border-t dark:border-gray-700">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Payment & Action */}
            <div className="space-y-4">
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-4 text-lg font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment (UPI/Card)</option>
              </select>

              <Button onClick={checkout} loading={loading} className="w-full py-5 text-xl font-bold rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-transform">
                Place Order
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div >
  );
}
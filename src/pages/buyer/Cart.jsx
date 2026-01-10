import useCartStore from "../../store/cartStore";
import { useLocation } from "../../context/LocationContext";
import { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const calcShipping = (itemCount, total) => {
  if (itemCount === 1) {
    if (total > 2000) return 0;
    if (total < 500) return 80;
    return 100;
  }
  if (total > 2000) {
    if (itemCount >= 5) return 0;
    return 100;
  }
  return 100;
};

export default function CartPage() {
  const { items, removeFromCart, updateQty, placeOrder, loading } = useCartStore();
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("COD");

  // Address State
  const { location } = useLocation();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressMode, setAddressMode] = useState("current"); // 'current' | 'saved' | 'new'
  const [selectedSavedAddr, setSelectedSavedAddr] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const currentLocationStr = location ? `${location.area}, ${location.district}, ${location.state} - ${location.pincode}` : "";

  // Group items by seller to calculate shipping per seller (matching backend logic)
  const sellerGroups = {};
  items.forEach(item => {
    const sid = item.sellerId || "unknown";
    if (!sellerGroups[sid]) sellerGroups[sid] = { count: 0, total: 0 };
    sellerGroups[sid].count += 1; // Backend counts distinct items, or total qty? Controller uses items.length
    sellerGroups[sid].total += item.price * item.qty;
  });

  let totalShipping = 0;
  Object.values(sellerGroups).forEach(group => {
    totalShipping += calcShipping(group.count, group.total);
  });

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = totalShipping;
  const grandTotal = total + shipping;

  useEffect(() => {
    // Fetch saved addresses from profile
    api.get("/buyer/profile")
      .then(({ data }) => {
        const addrs = data.addresses || [];
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          setSelectedSavedAddr(addrs[0]);
        }
        // If saved addresses exist, default is still 'current' if available, else 'saved'
        if (!location && addrs.length > 0) setAddressMode("saved");
        else if (!location && addrs.length === 0) setAddressMode("new");
      })
      .catch((err) => console.error("Failed to load addresses", err));
  }, []);

  const checkout = async () => {
    let finalAddress = "";

    if (addressMode === "current") {
      if (!currentLocationStr) {
        toast.error("Current location unavailable");
        return;
      }
      finalAddress = currentLocationStr;
    } else if (addressMode === "saved") {
      if (!selectedSavedAddr) {
        toast.error("Please select a saved address");
        return;
      }
      finalAddress = selectedSavedAddr;
    } else {
      if (!newAddress.trim()) {
        toast.error("Please enter a shipping address");
        return;
      }
      finalAddress = newAddress;
    }

    try {
      await placeOrder(paymentType, { fullAddress: finalAddress });
      navigate("/buyer/order-success");
    } catch (err) {
      // errors handled in store
    }
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your cart is empty</h2>
        <p className="text-gray-500 dark:text-gray-400">Looks like you haven't added anything yet.</p>
        <Link to="/buyer/shop" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Shopping Cart ({items.length})</h2>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:flex sm:flex-col sm:gap-4">
          {items.map((it) => (
            <div key={it.productId} className="bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-xl shadow-sm border dark:border-gray-700 flex flex-col sm:flex-row gap-2 sm:gap-4 transition hover:shadow-md">
              <div className="w-full h-32 sm:w-28 sm:h-28 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0 overflow-hidden">
                {it.image ? (
                  <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm sm:text-lg text-gray-800 dark:text-gray-100 line-clamp-2 md:line-clamp-1">{it.title}</h3>
                  <p className="font-bold text-sm sm:text-base text-blue-600 mt-1">₹{it.price}</p>
                </div>

                <div className="flex items-center justify-between mt-2 sm:mt-3">
                  <div className="flex items-center border dark:border-gray-600 rounded-lg overflow-hidden h-7 sm:h-auto">
                    <button
                      onClick={() => updateQty(it.productId, Math.max(1, it.qty - 1))}
                      className="px-2 sm:px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs sm:text-base"
                    >-</button>
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                      className="w-8 sm:w-12 text-center border-none focus:ring-0 p-1 bg-white dark:bg-gray-800 dark:text-white text-xs sm:text-sm"
                    />
                    <button
                      onClick={() => updateQty(it.productId, it.qty + 1)}
                      className="px-2 sm:px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-xs sm:text-base"
                    >+</button>
                  </div>
                  <button onClick={() => removeFromCart(it.productId)} className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 sticky top-4 space-y-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : "text-gray-900 dark:text-white"}>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>

              {/* Shipping Breakdown Debug/Info */}
              {Object.keys(sellerGroups).length > 0 && (
                <div className="text-xs text-gray-500 space-y-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                  {Object.entries(sellerGroups).map(([sid, group]) => (
                    <div key={sid} className="flex justify-between">
                      <span>
                        Seller {sid === "unknown" ? "(Old Items)" : "..." + sid.slice(-4)}:
                      </span>
                      <span>₹{calcShipping(group.count, group.total)}</span>
                    </div>
                  ))}
                  {sellerGroups["unknown"] && (
                    <p className="text-red-500 text-[10px]">
                      * Remove/Re-add old items to fix shipping
                    </p>
                  )}
                </div>
              )}
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">Shipping Address</h4>

              {/* Mode Selection */}
              <div className="flex flex-col gap-2 text-sm">
                {location && (
                  <label className="flex items-center gap-2 cursor-pointer bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                    <input
                      type="radio"
                      name="addrMode"
                      checked={addressMode === "current"}
                      onChange={() => setAddressMode("current")}
                    />
                    <div>
                      <span className="font-semibold text-blue-700 dark:text-blue-300">Default: Current Location</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{currentLocationStr}</p>
                    </div>
                  </label>
                )}

                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addrMode"
                      checked={addressMode === "saved"}
                      onChange={() => setAddressMode("saved")}
                      disabled={savedAddresses.length === 0}
                    />
                    <span>Saved Address</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addrMode"
                      checked={addressMode === "new"}
                      onChange={() => setAddressMode("new")}
                    />
                    <span>New Address</span>
                  </label>
                </div>

                {/* Input Area */}
                {addressMode === "saved" && (
                  savedAddresses.length > 0 ? (
                    <select
                      value={selectedSavedAddr}
                      onChange={(e) => setSelectedSavedAddr(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm"
                    >
                      {savedAddresses.map((addr, i) => (
                        <option key={i} value={addr}>{addr.length > 40 ? addr.slice(0, 40) + "..." : addr}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-red-500">No saved addresses found.</p>
                  )
                )}

                {addressMode === "new" && (
                  <textarea
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter full shipping address..."
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm h-20"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            <Button onClick={checkout} loading={loading} className="w-full py-3 text-lg">
              Checkout Now
            </Button>

            <p className="text-xs text-center text-gray-500">
              Secure checkout powered by Ketalog
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
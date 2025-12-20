import useCartStore from "../../store/cartStore";
import { useState } from "react";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, removeFromCart, updateQty, placeOrder, loading } = useCartStore();
  const [paymentType, setPaymentType] = useState("COD");

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = async () => {
    try {
      await placeOrder(paymentType);
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
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <div key={it.productId} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700 flex gap-4 transition hover:shadow-md">
              <div className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-lg shrink-0 overflow-hidden">
                {it.image ? (
                  <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 line-clamp-1">{it.title}</h3>
                  <p className="font-bold text-blue-600 mt-1">₹{it.price}</p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(it.productId, Math.max(1, it.qty - 1))}
                      className="px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >-</button>
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) => updateQty(it.productId, Number(e.target.value))}
                      className="w-12 text-center border-none focus:ring-0 p-1 bg-white dark:bg-gray-800 dark:text-white text-sm"
                    />
                    <button
                      onClick={() => updateQty(it.productId, it.qty + 1)}
                      className="px-3 py-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >+</button>
                  </div>
                  <button onClick={() => removeFromCart(it.productId)} className="text-sm text-red-500 hover:text-red-700 font-medium">
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
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t dark:border-gray-700 pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{total}</span>
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
              Secure checkout powered by B2C Website
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function OrderSuccess() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6 animate-fadeIn">
            <CheckCircleIcon className="w-24 h-24 text-green-500" />

            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Placed Successfully!</h1>
                <p className="text-gray-500 dark:text-gray-400">Thank you for your purchase. Your order has been received.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-4">
                <Link
                    to="/buyer/shop"
                    className="flex-1 w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Go to Shop
                </Link>
                <Link
                    to="/buyer/orders"
                    className="flex-1 w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
                >
                    Go to Orders
                </Link>
            </div>
        </div>
    );
}

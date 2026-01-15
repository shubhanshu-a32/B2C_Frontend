import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function SellerCard({ seller, requireLogin = false }) {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);

    const handleClick = () => {
        if (requireLogin && !user) {
            toast.error("Please login to view seller details");
            navigate("/login");
            return;
        }
        navigate(`/buyer/seller/${seller._id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 min-w-[220px] w-[220px] cursor-pointer hover:shadow-lg transition border border-transparent dark:border-gray-700 flex flex-col items-center text-center gap-3"
        >
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-300 overflow-hidden">
                {seller.profilePicture ? (
                    <img src={seller.profilePicture} alt={seller.shopName} className="w-full h-full object-cover" />
                ) : (
                    seller.shopName ? seller.shopName.charAt(0).toUpperCase() : 'S'
                )}
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {seller.shopName || "Seller"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {seller.ownerName}
                </p>
            </div>
            <button className="text-sm text-blue-600 font-medium hover:underline mt-2">
                Visit Shop
            </button>
        </div>
    );
}

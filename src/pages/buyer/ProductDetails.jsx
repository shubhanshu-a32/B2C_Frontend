import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import {
  ArrowLeft, Heart, Star, ShoppingCart, Zap,
  MapPin, ShieldCheck, Truck, RotateCcw, ChevronRight
} from "lucide-react";
import ProductDetailsSkeleton from "../../components/ui/preloaders/ProductDetailsSkeleton";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Review Form State


  // Store hooks
  const addToCart = useCartStore((s) => s.addToCart);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wishlistItems = useWishlistStore((s) => s.items);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }

        // Load reviews
        const reviewsRes = await api.get(`/products/${id}/reviews`);
        setReviews(reviewsRes.data);
      } catch (error) {
        toast.error("Failed to load product");
        console.error(error);
      }
    };
    load();
  }, [id]);

  const isInWishlist = product && wishlistItems.some((i) => i._id === product._id);

  const requireLogin = () => {
    toast.error("Please login as buyer to continue");
    navigate("/login?role=buyer");
  };

  const handleAddToCart = () => {
    if (!user || user.role !== "buyer") return requireLogin();
    if (product.stock <= 0) return toast.error("Out of stock");
    addToCart(product, quantity); // Assuming store handles existing quantity update or we just add
    // toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (!user || user.role !== "buyer") return requireLogin();
    if (product.stock <= 0) return toast.error("Out of stock");
    addToCart(product, quantity);
    navigate("/buyer/cart");
  };

  const handleWishlist = () => {
    if (!user || user.role !== "buyer") return requireLogin();
    toggleWishlist(product);
  };



  if (!product) {
    return <ProductDetailsSkeleton />;
  }

  // Calculate generic delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryDateString = deliveryDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans pb-12">
      {/* Breadcrumb / Back Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link to="/buyer/shop" className="hover:text-blue-600 flex items-center">
            Shop
          </Link>
          <ChevronRight size={16} />
          <span className="truncate max-w-[200px]">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col-reverse lg:flex-row gap-4 h-fit lg:sticky lg:top-24">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] scrollbar-hide py-1 px-1">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setActiveImage(img)}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 border-2 rounded hover:shadow-md transition overflow-hidden bg-white
                  ${activeImage === img ? "border-blue-600" : "border-transparent"}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

          {/* Main Image Stage */}
          <div
            className="flex-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 flex items-center justify-center relative overflow-hidden group min-h-[400px] lg:min-h-[500px]"
            onMouseMove={(e) => {
              if (window.innerWidth >= 1024) { // Only zoom on desktop
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                e.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                e.currentTarget.style.setProperty('--zoom-y', `${y}%`);
                setIsZoomed(true);
              }
            }}
            onMouseLeave={() => setIsZoomed(false)}
            style={{ cursor: "crosshair" }}
          >
            {/* Wishlist Button Overlay */}
            <button
              onClick={handleWishlist}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-110 transition text-gray-400 hover:text-red-500"
            >
              <Heart size={22} fill={isInWishlist ? "#ef4444" : "none"} className={isInWishlist ? "text-red-500" : ""} />
            </button>

            {activeImage ? (
              <img
                src={activeImage}
                alt={product.title}
                className={`max-w-full max-h-full object-contain transition-transform duration-200 ease-out origin-center
                    ${isZoomed ? "scale-150" : "scale-100"}`}
                style={isZoomed ? { transformOrigin: "var(--zoom-x) var(--zoom-y)" } : {}}
              />
            ) : (
              <div className="text-gray-400">No Image Available</div>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Product Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {product.title}
            </h1>
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-white bg-green-600 px-2 py-0.5 rounded text-sm font-bold max-w-fit">
                {product.rating?.toFixed(1) || 0} <Star size={14} className="ml-1 fill-white" />
              </div>
              <span className="text-gray-500 text-sm">{product.numReviews} Ratings & {reviews.length} Reviews</span>
            </div>
          </div>

          <div className="border-t border-b dark:border-gray-700 py-4 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{product.price?.toLocaleString()}</span>
              {/* Mock MRP */}
              <span className="text-gray-500 line-through text-md">₹{(product.price * 1.2).toFixed(0)}</span>
              <span className="text-green-600 font-bold text-sm">20% off</span>
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* Offers */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase text-gray-500">Available Offers</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex gap-2">
                <Zap className="text-green-600 w-5 h-5 flex-shrink-0" />
                <span><span className="font-bold">Bank Offer</span> 5% Unlimited Cashback on Axis Bank Credit Card</span>
              </li>
              <li className="flex gap-2">
                <Zap className="text-green-600 w-5 h-5 flex-shrink-0" />
                <span><span className="font-bold">Partner Offer</span> Sign up for Pay Later and get ₹500 Gift Card</span>
              </li>
            </ul>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">About this item</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {product.description || "No description available for this product."}
            </p>
            {product.variant && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 mt-3 inline-block">
                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold tracking-wider block mb-1">Variant</span>
                <span className="text-gray-900 dark:text-white font-medium">{product.variant}</span>
              </div>
            )}
          </div>

          {/* Service Badges */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-blue-50 dark:bg-gray-800 p-2 rounded-full text-blue-600">
                <Truck size={20} />
              </div>
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-blue-50 dark:bg-gray-800 p-2 rounded-full text-blue-600">
                <RotateCcw size={20} />
              </div>
              <span>7 Day Replacement</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-blue-50 dark:bg-gray-800 p-2 rounded-full text-blue-600">
                <ShieldCheck size={20} />
              </div>
              <span>Warranty</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="bg-blue-50 dark:bg-gray-800 p-2 rounded-full text-blue-600">
                <Star size={20} />
              </div>
              <span>Top Brand</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Buy Box / Actions (3 cols) */}
        <div className="lg:col-span-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold mb-4">₹{product.price?.toLocaleString()}</h3>

            <div className="space-y-1 mb-6 text-sm">
              <p className="text-green-600 font-semibold">In Stock</p>
              {/* Could check stock < 10 for urgency */}
              <p className="text-gray-600 dark:text-gray-400">
                Delivery by <span className="font-bold text-gray-900 dark:text-white">{deliveryDateString}</span>
              </p>
              <div className="flex items-center gap-1 text-gray-500 mt-2">
                <MapPin size={14} />
                <span>Deliver to User</span>
              </div>
            </div>

            {/* Seller Info Mini */}
            {product.sellerId && (
              <div className="text-sm border-t border-b py-3 my-4 border-gray-100 dark:border-gray-700">
                <p className="text-gray-500">Sold by</p>
                <Link to={`/buyer/seller/${product.sellerId._id}`} className="text-blue-600 font-semibold hover:underline">
                  {product.sellerId.shopName || "Unknown Seller"}
                </Link>
                {product.sellerId.address && (
                  <p className="text-xs text-gray-400 truncate mt-1">{product.sellerId.address}</p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-full shadow-sm transition-colors flex justify-center items-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full shadow-sm transition-colors flex justify-center items-center gap-2"
              >
                <Zap size={18} /> Buy Now
              </button>
            </div>


          </div>
        </div>

      </div>

    </div>
  );
}
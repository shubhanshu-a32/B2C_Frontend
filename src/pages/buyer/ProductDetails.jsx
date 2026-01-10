import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import {
  ArrowLeft, Heart, Star, ShoppingCart, Zap,
  MapPin, ShieldCheck, Truck, RotateCcw, ChevronRight, ChevronLeft
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  /* ---------- IMAGE SLIDER LOGIC ---------- */
  const handleImageNavigation = (direction) => {
    if (!product?.images?.length) return;

    // Find index using the URL string match
    const currentIndex = product.images.findIndex(img => img === activeImage);
    let nextIndex;

    if (direction === "next") {
      nextIndex = (currentIndex + 1) % product.images.length;
    } else {
      nextIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    }

    setActiveImage(product.images[nextIndex]);
  };


  if (!product) {
    return <ProductDetailsSkeleton />;
  }

  // Calculate generic delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryDateString = deliveryDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
  const isOutOfStock = product.stock <= 0;

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
            className="flex-1 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 flex items-center justify-center relative overflow-hidden group min-h-[400px] lg:min-h-[500px] cursor-zoom-in"
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
            onClick={() => setLightboxOpen(true)}
          >
            {/* Wishlist Button Overlay */}
            <button
              onClick={(e) => { e.stopPropagation(); handleWishlist(); }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:scale-110 transition text-gray-400 hover:text-red-500"
            >
              <Heart size={22} fill={isInWishlist ? "#ef4444" : "none"} className={isInWishlist ? "text-red-500" : ""} />
            </button>

            {/* Slider Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleImageNavigation("prev"); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white shadow-md transition-all hover:scale-110"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); handleImageNavigation("next"); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 dark:bg-black/70 hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white shadow-md transition-all hover:scale-110"
                  aria-label="Next Image"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Image Counter Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-xs rounded-full pointer-events-none">
                  {product.images.indexOf(activeImage) + 1} / {product.images.length}
                </div>
              </>
            )}

            {activeImage ? (
              <img
                src={activeImage}
                alt={product.title}
                className={`max-w-full max-h-full object-contain transition-transform duration-200 ease-out origin-center
                    ${isZoomed ? "scale-[2]" : "scale-100"}`}
                style={isZoomed ? { transformOrigin: "var(--zoom-x) var(--zoom-y)" } : {}}
              />
            ) : (
              <div className="text-gray-400">No Image Available</div>
            )}
          </div>
        </div>

        {/* LIGHTBOX OVERLAY */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
              onClick={() => setLightboxOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <img
              src={activeImage}
              alt="Full view"
              className="max-w-full max-h-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />
          </div>
        )}

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
            {/* Product Specs */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
              {product.specs?.size && (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="font-semibold">Size:</span> {product.specs.size}
                </div>
              )}
              {product.specs?.color && (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="font-semibold">Color:</span> {product.specs.color}
                </div>
              )}
              {product.specs?.weight && (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="font-semibold">Weight:</span> {product.specs.weight}{product.specs.weightUnit}
                </div>
              )}
              {/* Fallback */}
              {!product.specs && product.variant && (
                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="font-semibold">Variant:</span> {product.variant}
                </div>
              )}
            </div>
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
              {isOutOfStock ? (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              ) : (
                <p className="text-green-600 font-semibold">In Stock</p>
              )}

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
                disabled={isOutOfStock}
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
                disabled={isOutOfStock}
                className={`w-full font-semibold py-3 rounded-full shadow-sm transition-colors flex justify-center items-center gap-2
                  ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-black'}`}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`w-full font-semibold py-3 rounded-full shadow-sm transition-colors flex justify-center items-center gap-2
                  ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
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
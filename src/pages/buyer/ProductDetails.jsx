import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import {
  ArrowLeft, Heart, Star, ShoppingCart, Zap,
  MapPin, ShieldCheck, Truck, RotateCcw, ChevronRight, ChevronLeft, Check
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
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

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

        // Load Variants
        try {
          // Assuming variantService is available or directly use api
          // backend/src/routes/variant.routes.js: GET /product/:productId -> /api/variants/product/:id
          const variantsRes = await api.get(`/variants/product/${id}`);
          setVariants(variantsRes.data);

          // Auto-select first active variant if available? Optional.
          // Let's force user to select or default to None if they want base product
          // But usually base product IS one of the variants if variants exist.
          if (variantsRes.data.length > 0) {
            const first = variantsRes.data[0];
            // setSelectedVariant(first); // Optional: auto select
            const attrs = {};
            first.attributes.forEach(a => attrs[a.name] = a.value);
            setSelectedAttributes(attrs);
            setSelectedVariant(first); // Let's auto-select first one for better UX
          }

        } catch (vError) {
          // console.warn("Failed to load variants", vError);
          setVariants([]);
        }

        // Load coupons for this product's category
        if (data.category) {
          try {
            setLoadingCoupons(true);
            const couponsRes = await api.get("/admin/offers/active");
            // Filter coupons that:
            // 1. Have no category restriction (empty array or null)
            // 2. OR include this product's category
            const applicableCoupons = couponsRes.data.filter(coupon => {
              if (!coupon.applicableCategories || coupon.applicableCategories.length === 0) {
                return true; // No restriction, applies to all
              }
              // Check if product's category is in the coupon's applicable categories
              return coupon.applicableCategories.some(
                catId => catId === data.category._id || catId === data.category
              );
            });
            setCoupons(applicableCoupons);
          } catch (error) {
            // console.error("Failed to load coupons:", error);
            setCoupons([]);
          } finally {
            setLoadingCoupons(false);
          }
        } else {
          setLoadingCoupons(false);
        }
      } catch (error) {
        toast.error("Failed to load product");
        // console.error(error);
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

    // Determine effective stock and price based on selection
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

    if (currentStock <= 0) return toast.error("Out of stock");

    // Create item to add
    const itemToAdd = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      selectedVariant: selectedVariant ? selectedVariant : null,
      // We override title or add variant info for display in cart
      title: selectedVariant ? `${product.title} (${selectedVariant.name})` : product.title
    };


    if (variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant option");
      return;
    }

    addToCart(itemToAdd, quantity, selectedVariant || null);
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    if (variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant option");
      return;
    }

    // Create item to add (Same logic as AddToCart)
    const itemToAdd = {
      ...product,
      price: selectedVariant ? selectedVariant.price : product.price,
      selectedVariant: selectedVariant ? selectedVariant : null,
      title: selectedVariant ? `${product.title} (${selectedVariant.name})` : product.title
    };

    addToCart(itemToAdd, 1, selectedVariant || null);
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

  // Use Selected Variant details if active, else Base Product
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

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
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{currentPrice?.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
          </div>

          {/* VARIANTS SECTION */}
          {/* VARIANTS SECTION - Multi-Attribute Selection */}
          <div className="mb-6 space-y-4">
            {Object.entries(
              variants.reduce((acc, v) => {
                v.attributes.forEach(attr => {
                  if (!acc[attr.name]) acc[attr.name] = new Set();
                  acc[attr.name].add(attr.value);
                });
                return acc;
              }, {})
            ).map(([attrName, valuesSet]) => {
              const values = Array.from(valuesSet);

              // Helper to check if a value is valid given ONLY the *other* currently selected attributes
              // This is complex. Simplified approach: Just show all options.
              // Better approach: Highlighting or enabling only valid? 
              // For now, let's render standard dropdowns.

              const currentVal = selectedAttributes[attrName] || "";

              return (
                <div key={attrName}>
                  <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">
                    {attrName}
                  </h3>
                  <div className="relative">
                    <select
                      value={currentVal}
                      onChange={(e) => {
                        const newVal = e.target.value;
                        const newAttrs = { ...selectedAttributes, [attrName]: newVal };
                        setSelectedAttributes(newAttrs);

                        // Attempt to find matching variant
                        const match = variants.find(v =>
                          v.attributes.every(a => newAttrs[a.name] === a.value) &&
                          // Ensure variant has exactly these attributes (length check optional if schema rigid)
                          v.attributes.length === Object.keys(newAttrs).length
                        );

                        // If exact match not found (e.g. invalid combo), check if we can find *any* variant 
                        // that matches the *newly changed* attribute to switch to valid state?
                        // Or just set to match || null.
                        // Let's set selectedVariant(match).
                        setSelectedVariant(match || null);

                        // Update Image if match found
                        if (match?.images?.length > 0) {
                          setActiveImage(match.images[0]);
                        }
                      }}
                      className="w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm cursor-pointer"
                    >
                      <option value="" disabled>Select {attrName}</option>
                      {values.map(val => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 sm:right-auto sm:left-56">
                      {/* Note: Icon positioning might need adjustment based on width, hardcoded left-56 is risky if width changes. 
                          Keeping standard right align is safer. */}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Status Message */}
            {Object.keys(selectedAttributes).length > 0 && !selectedVariant && (
              <p className="text-red-500 text-sm mt-2">
                This combination is unavailable.
              </p>
            )}

            {variants.length === 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 italic flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                  No variants available
                </p>
              </div>
            )}
          </div>


          {/* Offers */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase text-gray-500">Available Offers</h3>
            {loadingCoupons ? (
              <div className="text-sm text-gray-500">Loading offers...</div>
            ) : coupons.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {coupons.map((coupon) => (
                  <li key={coupon._id} className="flex gap-2">
                    <Zap className="text-green-600 w-5 h-5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold">{coupon.code}</span> - {coupon.tagline}
                      {coupon.minCartAmount > 0 && (
                        <span className="text-xs text-gray-500 block">Min cart: ₹{coupon.minCartAmount}</span>
                      )}
                      {coupon.expiryDate && (
                        <span className="text-xs text-gray-500 block">
                          Valid till: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No coupons and offers are available</p>
            )}
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
              <span>Secure Delivery</span>
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
            <h3 className="text-xl font-bold mb-4">₹{currentPrice?.toLocaleString()}</h3>

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
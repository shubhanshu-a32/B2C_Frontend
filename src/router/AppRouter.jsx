import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import MainLanding from "../pages/Landing";
import Login from "../pages/auth/Login";
import OTPVerify from "../pages/auth/OTPVerify";

// Layouts
import BuyerLayout from "../layouts/BuyerLayout";
import SellerLayout from "../layouts/SellerLayout";
import PublicLayout from "../layouts/PublicLayout";

// Buyer Pages
import BuyerDashboard from "../pages/buyer/BuyerDashboard";
import Shop from "../pages/buyer/Shop";
import ProductDetails from "../pages/buyer/ProductDetails";
import BuyerOrders from "../pages/buyer/BuyerOrders";
import BuyerProfile from "../pages/buyer/BuyerProfile";
import WishlistPage from "../pages/buyer/Wishlist";
import CartPage from "../pages/buyer/Cart";
import SellerShop from "../pages/buyer/SellerShop";

// Seller Pages
import SellerDashboard from "../pages/seller/SellerDashboard";
import ManageProducts from "../pages/seller/ManageProducts";
import AddProduct from "../pages/seller/AddProduct";
import EditProduct from "../pages/seller/EditProduct";
import SellerProfile from "../pages/seller/SellerProfile";
import TotalOrders from "../pages/seller/TotalOrders";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<MainLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OTPVerify />} />

        {/* Public Shop Routes (Visible to guests and logged-in users) */}
        <Route element={<PublicLayout />}>
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

        {/* Buyer Routes */}
        <Route
          path="/buyer"
          element={
            <ProtectedRoute role="buyer">
              <BuyerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="seller/:sellerId" element={<SellerShop />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="profile" element={<BuyerProfile />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        {/* Seller Routes */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute role="seller">
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="dashboard/total-orders" element={<TotalOrders />} />
        </Route>

        <Route path="*" element={<h1 className="p-10 text-center">Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

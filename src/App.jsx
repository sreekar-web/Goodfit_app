import { Routes, Route, useLocation } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import TryAndBuy from "./pages/TryAndBuy";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import TryBuyTracking from "./pages/TryBuyTracking";
import SearchBrowse from "./pages/SearchBrowse";
import Wishlist from "./pages/Wishlist";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import SignUp from "./pages/SignUp";

function App() {
  const location = useLocation();
  const hideNav = ["/cart", "/myorders", "/order", "/trybuytracking", "/search", "/wishlist", "/splash", "/login", "/checkout", "/signup"].some(
    (path) => location.pathname.startsWith(path)
  );

  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="w-full max-w-sm">
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/tryandbuy" element={<TryAndBuy />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/trybuytracking/:orderId" element={<TryBuyTracking />} />
          <Route path="/search" element={<SearchBrowse />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>

        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}

export default App;
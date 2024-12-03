import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './components/Cart/CartContext';
import NavBar from "./components/NavBar/navbar.jsx";
import Home from "./components/Home/home";
import Footer from "./components/Footer/footer";
import MenuPage from "./components/Menu/menu";
import Login from './components/Login/login.jsx';
import SignUp from './components/SignUp/signup.jsx';
import UserProfile from "./components/Profile/user.jsx";
import AddItem from "./components/Items/Form.jsx";
import ShoppingCart from './components/Cart/ShoppingCart.jsx';
import ErrorPage from './components/Error/error'; 
import AdminDashboard from './components/Admin/AdminPage'; 
import AboutUs from "./components/About-Us/aboutpage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AllCategories from './components/Items/AllCategories.jsx';
import AllCategories1 from './components/Items/AllCategories1.jsx';
import { useCookies } from 'react-cookie';
import Reviews from './components/Items/Reviews.jsx';
import AllrectOrder from './components/Items/AllrectOrder.jsx';
import AllPayments from './components/Items/AllPayments.jsx';

function App() {
  const [cookies] = useCookies(['token']);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUserData = async () => {
    const token = cookies.token;

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ProtectedRoute component
  const ProtectedRoute = ({ children, isAdminRoute }) => {
    if (loading) {
      return <div>Loading...</div>; // Optionally replace with a spinner or loader component
    }
  
    if (!user) {
      return <Navigate to="/sign-in" replace />;
    }
  
    // Check if the route is admin-protected and if the user has the Admin role
    if (isAdminRoute && user.role !== 'Admin') {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };
  

  // PublicRoute component
  const PublicRoute = ({ children }) => {
    if (loading) {
      return <div>Loading...</div>; // Optional: Replace with a spinner/loader.
    }

    if (user) {
      // Redirect users based on their roles
      return user.role === 'Admin' ? <Navigate to="/" replace /> : <Navigate to="/" replace />;
    }

    return children;
  };

  return (
    <CartProvider>
      <Router>
        <div className="main-body">
          <NavBar />
          
          <Routes>
  {/* Public Routes */}
  <Route 
    path="/sign-in" 
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    } 
  />
  <Route 
    path="/sign-up" 
    element={
      <PublicRoute>
        <SignUp />
      </PublicRoute>
    } 
  />

  {/* Regular Routes */}
  <Route path="/" element={<><Home /><Footer /></>} />
  <Route path="/menu" element={<><MenuPage /><Footer /></>} />
  <Route path="/profile" element={<UserProfile />} />
  <Route path="/cart" element={<ShoppingCart />} />
  <Route path="/about-us" element={<><AboutUs /><Footer /></>} />

  {/* Admin Protected Routes */}
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute isAdminRoute={true}>
        <><AdminDashboard /><Footer /></>
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/admin/add-items" 
    element={
      <ProtectedRoute isAdminRoute={true}>
        <><AddItem /><Footer /></>
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/admin/categories" 
    element={
      <ProtectedRoute isAdminRoute={true}>
        <><AllCategories /><Footer /></>
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/admin/categories1" 
    element={
      <ProtectedRoute isAdminRoute={true}>
        <><AllCategories1 /><Footer /></>
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/admin/Review" 
    element={
      <ProtectedRoute isAdminRoute={true}>
       <>
       <Reviews /><Footer />
       </> 
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/admin/alrect" 
    element={
      <ProtectedRoute isAdminRoute={true}>
      <>
      <AllrectOrder/><Footer />
      </>
      </ProtectedRoute>
    } 
  />
  <Route 
    path="/admin/alpay" 
    element={
      <ProtectedRoute isAdminRoute={true}>
      <>
      <AllPayments/><Footer />
      </>
      </ProtectedRoute>
    } 
  />

  {/* Fallback Route */}
  <Route path="*" element={<ErrorPage />} />
</Routes>

          <ToastContainer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

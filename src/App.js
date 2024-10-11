import { ThemeProvider } from '@material-tailwind/react';
import './App.css';
import StickyNavbar from './components/StickyNavbar';
import Footer from './components/Footer';
import UserLogin from './components/UserLogin';
import Loginpage from './pages/Loginpage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import AdminLogin from './AdminPages/AdminLogin';
import Home from './pages/Home';
import Product from './pages/Product';
import AdminHome from './AdminPages/AdminHome';
import AddProduct from './AdminPages/AddProduct';
import EditProduct from './AdminPages/EditProduct';
import ProductList from './pages/ProductList';
import ConfiremEmail from './pages/ConfiremEmail';
import ForgottPassword from './components/ForgottPassword';
import Users from './pages/Users';
import AdminAuth from './AdminComponents/AdminAuth';
import ConfirmationDialog from './AdminComponents/ConfirmationDialogue';
import UserAuth from './components/UserAuth.';
import FilterPage from './pages/FilterPage';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderView from './AdminPages/OrderView';
import Checkoutpageforsingleproduct from './pages/Checkoutpageforsingleproduct';
import OrderSuccess from './components/OrderSuccess';
import Payment from './Payment/Payment'
import '../src/static/styles/Colors.css'
import Contact from './pages/Contact';
import Service from './pages/Service';
function App() {
  const isAdminAuth = AdminAuth();
  const isUserAuth = UserAuth();
  console.log(isUserAuth)
  
  return (
    <div className="app-container">
      <ThemeProvider>
        <Router>
          <Routes>
            {/* User Routes */}
            <Route path='/user/login/' element={<Loginpage />} />
            <Route path='user/signup/' element={<Signup />} />
            <Route path='user/home/' element={isUserAuth ? <Home /> : <Navigate to='/user/login/' />} />
            <Route path='user/product/:id' element={isUserAuth ? <Product /> : <Navigate to='/user/login/' />} />
            <Route path='user/verify-email' element=<ConfiremEmail />  />
            <Route path='user/forgot-password' element= <ForgottPassword /> />
            <Route path='user/filterpage/' element=<FilterPage/> />
            <Route path='user/cart' element={isUserAuth ? <Cart /> : <Navigate to='/user/login/' />} />
            <Route path='user/profile/:page' element={isUserAuth ? <Profile/> : <Navigate to='/user/login/' />} />
            <Route path='user/checkout' element={isUserAuth ? <Checkout /> : <Navigate to='/user/login/' />} />
            <Route 
          path="/user/product/cart" 
          element={isUserAuth ? <Checkoutpageforsingleproduct /> : <Navigate to='/user/login/' />} 
        />
          <Route path='user/order/success' element=<OrderSuccess/>/>
          <Route path='user/payment' element={isUserAuth ? <Payment /> : <Navigate to='/user/login/' />}/>
          <Route path='user/contact' element=<Contact/>/>
          <Route path='user/service' element=<Service/>/>
          <Route path='*' element={<Loginpage/>}/>





            {/* <Route path='user/explore' element=<Component/>/> */}

            {/* Admin Routes */}
            <Route path='/admin/login/' element={<AdminLogin />} />
            <Route path='/admin/home/:page' element={isAdminAuth ? <AdminHome /> : <Navigate to='/admin/login/' />} />
            <Route path='/admin/add/' element={isAdminAuth ? <AddProduct /> : <Navigate to='/admin/login/' />} />
            <Route path='/admin/product/edit/:id' element={isAdminAuth ? <EditProduct /> : <Navigate to='/admin/login/' />} />
            <Route path='/admin/product/list' element={isAdminAuth ? <ProductList /> : <Navigate to='/admin/login/' />} />
            <Route path='/admin/usertable' element={isAdminAuth ? <Users /> : <Navigate to='/admin/login/' />} />
            <Route path='/admin/view/order/:orderid/'  element=<OrderView/> />
            <Route path='test/' element={<ConfirmationDialog />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
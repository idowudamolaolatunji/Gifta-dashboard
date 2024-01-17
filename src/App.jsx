import React from 'react'
import ProtectedRoute from './utils/PrivateRoutes'
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import DashBoard from './Pages/DashBoard';

import Gifting from './Pages/Gifting';
import Marketplace from './Pages/Marketplace';
import Wishlists from './Pages/Wishlists';
import Reminders from './Pages/Reminders';

import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import CategoryPage from './Pages/Marketplace/MarketComponent/MarketProducts';
import WishListUi from './Pages/Wishlists/WishlistsComponents/WishListUi';

import SharedWishlist from './Pages/PublicPages/SharedWishlist';
import Wallet from './Pages/PublicPages/Wallet';
import './index.css'
import './Pages/DashBoard/main.css';
import './query.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />}></Route>
          <Route path="/" element={<DashBoard />}></Route>

          <Route path="/dashboard/gifting" element={<Gifting />}></Route>
          <Route path="/dashboard/marketplace/:category" element={<Marketplace />}></Route>
          <Route path="/dashboard/marketplace/:category/:productSlug" element={<Marketplace />}></Route>
          
          <Route path="/dashboard/wishlists" element={<Wishlists />}></Route>
          <Route path="/dashboard/wishlists/:wishListSlug" element={<WishListUi />}></Route>
          <Route path="/dashboard/wishlists/:wishListSlug/wish" element={<WishListUi />}></Route>
          <Route path="/dashboard/wishlists/:wishListSlug/wish/edit" element={<WishListUi />}></Route>
          <Route path="/dashboard/wishlists/:wishListSlug/wish/delete" element={<WishListUi />}></Route>

          <Route path="/dashboard/reminders" element={<Reminders />}></Route>

          <Route path="/wallet" element={<Wallet />}></Route>
        </Route>

        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/shared/:shareableUrl" element={<SharedWishlist />}></Route>

    </Routes>
    </BrowserRouter>
  )
}


export default App
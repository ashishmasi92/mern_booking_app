import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout.tsx";
import Layout from "./layout/Layout.tsx";
import Register from "./pages/Register";
import Login from "./pages/Login.tsx";
import AddHotel from "./pages/AddHotel.tsx";
import MyHome from "./pages/MyHome.tsx";
import ProtectedRoute from "./layout/ProtectedRoute.tsx";
import MyHotel from "./pages/MyHotel.tsx";
import EditHotel from "./pages/EditHotel.tsx";
import Search from "./pages/Search.tsx";
import Details from "./components/Details.tsx";
import Booking from "./pages/Booking.tsx";

function App() {
  return (
    <>
      <Routes>
        {/* PUBLIC MAIN PAGES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MyHome />} />
          <Route path="/search" element={<Search />} />
        </Route>

        {/* AUTH PAGES */}
        <Route element={<Layout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/edit-hotel/:hotelId" element={<EditHotel />} />
          <Route path="/detail/:hotelId" element={<Details />} />
        </Route>

        {/* PROTECTED PAGES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/hotel/:hotelId/booking" element={<Booking />} />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/my-hotels" element={<MyHotel />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;

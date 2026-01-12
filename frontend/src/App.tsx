import { Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./layout/MainLayout";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddHotel from "./pages/AddHotel";
import MyHome from "./pages/MyHome";
import ProtectedRoute from "./layout/ProtectedRoute";
import MyHotel from "./pages/MyHotel";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Details from "./components/Details";
import Booking from "./pages/Booking";

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

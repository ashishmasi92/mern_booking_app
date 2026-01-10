import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto">
        <SearchBar />
      </div>
      <div className="container mx-auto py-3 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}


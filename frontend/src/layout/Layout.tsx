import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { Outlet } from "react-router-dom";
// interface Props{
//   children:React.ReactNode;
// }

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      
      <div className="container mx-auto py-3 flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 text-slate-950 dark:bg-[#0b1120] dark:text-slate-100">
      <Navbar />
      <div className="flex-1"><Outlet /></div>
      <Footer />
    </div>
  );
}

export default PublicLayout;

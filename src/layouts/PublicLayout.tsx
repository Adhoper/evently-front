import {
  Outlet,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default PublicLayout;
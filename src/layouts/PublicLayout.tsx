import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default PublicLayout;
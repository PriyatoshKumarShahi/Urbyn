import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { MapPinned, Shield, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";
import { MdTraffic } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";

const InitialAvatar = ({ name }) => (
  <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-ink bg-butter text-lg font-black shadow-brutalSm">
    {(name || "U").charAt(0).toUpperCase()}
  </div>
);

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream px-4 py-5 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="brutal-card flex flex-col gap-4 bg-paper p-4 md:flex-row md:items-center md:justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Urbyn Logo"
              className="h-20 w-48 rounded-[18px]   p-1"
            />

            {/* <div>
              <h1 className="text-3xl font-black">Urbyn</h1>
              <p className="text-sm font-medium text-slate-600">
                Accountability Starts Here
              </p>
            </div> */}
          </Link>
          <nav className="flex flex-wrap items-center gap-3">
            <NavLink to="/dashboard" className="brutal-btn bg-blush px-4 py-2">
              Explore
            </NavLink>
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className="brutal-btn bg-skybubble px-4 py-2"
              >
                Admin
              </NavLink>
            )}
            {user ? (
              <>
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 rounded-[18px] border-[3px] border-ink bg-white px-3 py-2 shadow-brutalSm"
                >
                  <InitialAvatar name={user.name} />
                  <div className="text-left">
                    <div className="text-sm font-black">{user.name}</div>
                    <div className="text-xs font-semibold text-slate-500">
                      {user.role}
                    </div>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="brutal-btn bg-white px-4 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="brutal-btn bg-mint px-4 py-2">
                Login
              </Link>
            )}
          </nav>
        </header>

        <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="flex items-center gap-2 rounded-[18px] border-[3px] border-ink bg-butter p-3 font-black shadow-brutalSm">
            <MdTraffic className="text-2xl text-red-500" />
            <span>Report, track, verify, and pressure for action.</span>
          </div>

          <div className="flex items-center gap-2 rounded-[18px] border-[3px] border-ink bg-skybubble p-3 font-black shadow-brutalSm">
            <FaMapMarkerAlt className="text-2xl text-blue-500" />
            <span>Hotspots + Heat map + SLA accountability</span>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

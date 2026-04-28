import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../api/auth";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const menuItems = [
    { icon: "👤", label: "My Profile",       route: null },
    { icon: "📦", label: "My Orders",        route: "/myorders" },
    { icon: "↩️", label: "Refund",           route: null },
    { icon: "🔒", label: "Change Password",  route: null },
    { icon: "🌐", label: "Change Language",  route: null },
  ];

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logout(refreshToken);
    } catch (err) {
      console.error(err);
    } finally {
      logoutUser();
      navigate("/");
    }
  };

  return (
    <div className="bg-[#080904] text-white min-h-screen flex justify-center">
      <div className="w-full max-w-sm pb-32">

        {/* TOP SECTION */}
        <div className="bg-[#111] rounded-b-3xl px-5 pt-8 pb-10 relative">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold">Profile</h1>
            <button className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white">
              ⋯
            </button>
          </div>

          {/* AVATAR */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-gray-600 overflow-hidden border-2 border-[#D5FF00]">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-3xl">
                    👤
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#D5FF00] rounded-full flex items-center justify-center">
                <span className="text-black text-xs">✏️</span>
              </button>
            </div>

            <h2 className="text-lg font-bold">{user?.name || "User"}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            {user?.phone && (
              <p className="text-gray-400 text-sm mt-0.5">{user.phone}</p>
            )}
          </div>
        </div>

        {/* ACCOUNT OVERVIEW */}
        <div className="mx-4 mt-5 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
          <p className="text-white font-semibold px-5 pt-5 pb-3">Account Overview</p>

          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => item.route && navigate(item.route)}
              className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors
                ${i !== menuItems.length - 1 ? "border-b border-white/10" : ""}`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#D5FF00]/10 flex items-center justify-center text-base flex-shrink-0">
                {item.icon}
              </div>
              <span className="flex-1 text-left text-sm text-[#F5F5F5]">{item.label}</span>
              <span className="text-gray-500 text-sm">›</span>
            </button>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="mx-4 mt-4">
          <button
            onClick={handleLogout}
            className="w-full border border-red-500/40 text-red-400 py-3 rounded-2xl text-sm font-semibold hover:bg-red-500/10 transition-colors"
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/", key: "home", labelEn: "Home", labelAr: "الرئيسية" },
  { to: "/dashboard", key: "dashboard", labelEn: "Dashboard", labelAr: "لوحة الطالب" },
];

export default function Navbar() {
  const { lang, setLang, dir } = useLanguage();
  const { user, logout } = useAuth();

  return (
    <header className="w-full shadow-sm bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <Link className="flex items-center gap-2" to="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-lg text-primary">
            {lang === "ar" ? "دليل التمريض" : "Nursing Guide"}
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`
              }
            >
              {lang === "ar" ? item.labelAr : item.labelEn}
            </NavLink>
          ))}
          {user?.role === "admin" && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`
              }
            >
              Admin
            </NavLink>
          )}
          {!user && (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-sm font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`
              }
            >
              {lang === "ar" ? "دخول" : "Login"}
            </NavLink>
          )}
          {user && (
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <span>{user.name}</span>
              <button
                onClick={logout}
                className="px-2 py-1 rounded-md bg-muted text-foreground text-xs"
              >
                {lang === "ar" ? "خروج" : "Logout"}
              </button>
            </div>
          )}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
            aria-label="Toggle language"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </nav>
      </div>
    </header>
  );
}

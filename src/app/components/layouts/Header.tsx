import { Search, Bell, Menu, User, ChevronDown, LogOut, Settings, UserCircle, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if dark mode is stored in localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [time] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  });

  const [date] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  });

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    navigate("/login");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="bg-white dark:bg-[#0f1f35] border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] h-16 px-6 flex items-center justify-between transition-colors">
      {/* Left side - Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] rounded-lg transition-colors"
        >
          <Menu className="size-5 text-[#111827] dark:text-[#e8eef5]" />
        </button>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#6b7280] dark:text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search events, plates, zones..."
            className="bg-[#f9fafb] dark:bg-[#1a2d47] border border-[#e5e7eb] dark:border-[#4b5563] rounded-lg pl-10 pr-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] placeholder:text-[#6b7280] dark:placeholder:text-[#9ca3af] w-full focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Right side - Time, Live indicator, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Time & Date */}
        <div className="border-r border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] pr-4 flex flex-col items-end">
          <span className="font-semibold text-sm text-[#111827] dark:text-[#e8eef5] tracking-tight">
            {time}
          </span>
          <span className="text-xs text-[#6b7280] dark:text-[#94a3b8]">{date}</span>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="size-2 bg-[#10b981] rounded-full" />
            <div className="size-2 bg-[#10b981] rounded-full absolute top-0 left-0 animate-ping" />
          </div>
          <span className="text-sm text-[#6b7280] dark:text-[#94a3b8]">Live</span>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="size-5 text-[#fbbf24]" />
          ) : (
            <Moon className="size-5 text-[#6b7280]" />
          )}
        </button>

        {/* Notifications */}
        

        {/* Profile with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 p-2 hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] rounded-lg transition-colors"
          >
            <div className="bg-[#3b82f6] rounded-full size-8 flex items-center justify-center">
              <User className="size-4 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm text-[#111827] dark:text-[#e8eef5] tracking-tight">
                Sarang A
              </span>
              <span className="text-xs text-[#6b7280] dark:text-[#94a3b8]">Admin</span>
            </div>
            <ChevronDown className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
          </button>

          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileDropdown(false)}
              />
              
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#0f1f35] rounded-lg border border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] shadow-lg z-20">
                <div className="p-3 border-b border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)]">
                  <p className="font-medium text-sm text-[#111827] dark:text-[#e8eef5]">Sarang A</p>
                  <p className="text-xs text-[#6b7280] dark:text-[#94a3b8]">admin@veriflow.com</p>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                    <UserCircle className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#111827] dark:text-[#e8eef5] hover:bg-[#f9fafb] dark:hover:bg-[rgba(30,58,95,0.5)] transition-colors">
                    <Settings className="size-4 text-[#6b7280] dark:text-[#94a3b8]" />
                    Settings
                  </button>
                </div>

                <div className="border-t border-[#e5e7eb] dark:border-[rgba(59,130,246,0.15)] py-2">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#ef4444] hover:bg-[#fef2f2] dark:hover:bg-[#7f1d1d] transition-colors"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
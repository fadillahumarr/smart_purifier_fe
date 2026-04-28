"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { logout, me } from "@/app/lib/api/auth";
import { clearAuthCookies } from "@/app/lib/api/cookies";
import routes from "@/app/lib/routes";
import Swal from "sweetalert2";
import { getActiveAlertCount } from "@/app/lib/api/alerts";

type MenuItem = {
  label: string;
  href: string;
  icon: string;
};

const menuItems: MenuItem[] = [
  { label: "Water Purifiers", href: routes.purifiers, icon: "material-symbols:air-purifier-outline-rounded" },
  { label: "Monitoring", href: routes.monitoring, icon: "mdi:monitor-dashboard" },
  { label: "Alerts", href: routes.alerts, icon: "fluent:alert-16-regular" },
];

const STORAGE_KEY = "sidebar-open";

function subscribe(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved !== null ? saved === "true" : true;
}

function getServerSnapshot(): boolean {
  return true;
}

function setSidebarOpen(value: boolean) {
  localStorage.setItem(STORAGE_KEY, String(value));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

const Sidebar = () => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const currentTheme = resolvedTheme ?? "light";

  const [user, setUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await me();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadAlertCount = async () => {
      try {
        const data = await getActiveAlertCount();
        setAlertCount(data.count);
      } catch (err) {
        console.error("Failed to fetch alert count:", err);
      }
    };

    loadAlertCount();

    const interval = setInterval(loadAlertCount, 5000);

    return () => clearInterval(interval);
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return "?";

    return user.name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [user]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to leave the dashboard?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Logging out...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await logout();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      clearAuthCookies();

      await Swal.fire({
        title: "Logged out",
        text: "You have been signed out successfully.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });

      window.location.replace(routes.login);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center border-b border-border bg-background px-4 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-1 hover:bg-foreground/10"
          aria-label="Open sidebar"
        >
          <Icon icon="jam:menu" className="text-[28px]" />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-xs font-bold uppercase tracking-widest text-secondary">
            Smart Water Purifier
          </h1>
        </div>
      </div>

      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-background/50 transition-opacity md:hidden ${isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
          }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-surface text-foreground transition-all duration-300 dark:bg-background md:sticky md:translate-x-0 ${isOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full md:w-20"
          }`}
      >
        <div className="relative flex h-24 items-center border-b border-border">
          {isOpen ? (
            <div className="relative flex w-full items-center gap-3 px-4">
              <Icon
                icon="material-symbols:water-drops-rounded"
                className="text-[36px] text-secondary"
              />

              <h1 className="text-xs font-bold uppercase tracking-widest text-secondary">
                Smart Water <br /> Purifier
              </h1>

              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 cursor-pointer hover:bg-foreground/10"
                aria-label="Collapse sidebar"
              >
                <Icon icon="mynaui:sidebar" />
              </button>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <div className="group relative flex h-10 w-10 items-center justify-center">
                <Icon
                  icon="material-symbols:water-drops-rounded"
                  className="text-[28px] text-secondary transition group-hover:opacity-0"
                />

                <button
                  onClick={() => setSidebarOpen(true)}
                  className="absolute flex h-8 w-8 items-center justify-center rounded opacity-0 cursor-pointer transition group-hover:opacity-100 hover:bg-foreground/10"
                  aria-label="Expand sidebar"
                >
                  <Icon icon="mynaui:sidebar" />
                </button>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-6">
          {isOpen && (
            <p className="px-3 pb-3 text-xs uppercase tracking-wider text-muted">
              Main Menu
            </p>
          )}

          <ul className="space-y-2">
            {menuItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              const isAlertMenu = item.label === "Alerts";

              return (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-xl px-3 py-3 transition ${active
                      ? "bg-secondary/10 text-secondary"
                      : "text-foreground hover:bg-tertiary/40"
                      } ${isOpen ? "gap-3" : "justify-center"}`}
                  >
                    <div className="relative">
                      <Icon icon={item.icon} className="text-2xl" />

                      {isAlertMenu && alertCount > 0 && (
                        <span className="absolute -top-1 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-background">
                          {alertCount > 99 ? "99+" : alertCount}
                        </span>
                      )}
                    </div>

                    {isOpen && <span className="text-sm">{item.label}</span>}
                  </Link>

                  {!isOpen && (
                    <span className="absolute top-1/2 left-full ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition group-hover:opacity-100">
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-border p-4">
          <button
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className={`flex w-full items-center rounded-xl px-3 py-2 cursor-pointer transition hover:bg-tertiary/40 dark:hover:bg-foreground/5 ${isOpen ? "gap-3" : "justify-center"
              }`}
          >
            <Icon
              suppressHydrationWarning
              icon={
                currentTheme === "dark"
                  ? "mdi:weather-night"
                  : "mdi:white-balance-sunny"
              }
              className="text-xl"
            />
            {isOpen && (
              <span suppressHydrationWarning className="text-sm">
                {currentTheme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
            )}
          </button>

          <div
            className={`rounded-2xl bg-surface p-3 shadow-card ${isOpen ? "" : "flex justify-center p-2"
              }`}
          >
            <div
              className={`flex items-center ${isOpen ? "justify-between gap-3" : "justify-center"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-background">
                  {initials}
                </div>

                {isOpen && (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{user?.name}</p>
                    <p className="truncate text-xs text-muted">{user?.email}</p>
                  </div>
                )}
              </div>

              {isOpen && (
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-muted cursor-pointer transition hover:bg-danger/10 hover:text-danger"
                  aria-label="Logout"
                >
                  <Icon
                    icon="material-symbols:logout-rounded"
                    className="text-lg"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
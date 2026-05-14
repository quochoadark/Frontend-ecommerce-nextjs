"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Bell,
  Search,
  Menu,
  X,
  ShoppingCart,
  Tags,
  Truck,
} from "lucide-react";
import clsx from "clsx";

// ─── Nav items ────────────────────────────────────────────────────────────────

const navGroups = [
  {
    label: "Tổng quan",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/analytics", icon: BarChart3, label: "Thống kê" },
    ],
  },
  {
    label: "Quản lý kho",
    items: [
      { href: "/admin/products", icon: Package, label: "Sản phẩm" },
      { href: "/admin/categories", icon: Tags, label: "Danh mục" },
    ],
  },
  {
    label: "Đơn hàng",
    items: [
      { href: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
      { href: "/admin/shipping", icon: Truck, label: "Vận chuyển" },
    ],
  },
  {
    label: "Người dùng",
    items: [
      { href: "/admin/customers", icon: Users, label: "Khách hàng" },
    ],
  },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { state, logout } = useAuth();
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex-shrink-0 flex flex-col h-screen sticky top-0 scrollbar-thin"
      style={{
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-16 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)" }}
        >
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-base gradient-text whitespace-nowrap"
            >
              ShopAdmin
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <button
        id="sidebar-toggle-btn"
        onClick={onToggle}
        className="absolute -right-3 top-[72px] z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
        }}
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronLeft className="w-3 h-3" />
        </motion.div>
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  id={`nav-${item.href.replace(/\//g, "-").slice(1)}`}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl mb-0.5 transition-all group",
                    isActive
                      ? "glow-accent"
                      : "hover:bg-[var(--bg-card-hover)]"
                  )}
                  style={{
                    background: isActive ? "rgba(108,99,255,0.15)" : undefined,
                    border: isActive ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                  }}
                >
                  <item.icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: isActive ? "var(--accent)" : "var(--text-secondary)" }}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div
        className="p-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Link
          id="nav-settings"
          href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all hover:bg-[var(--bg-card-hover)]"
        >
          <Settings className="w-5 h-5 flex-shrink-0" style={{ color: "var(--text-secondary)" }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap"
                style={{ color: "var(--text-secondary)" }}
              >
                Cài đặt
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* User info */}
        {!collapsed && state.user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl mb-1"
            style={{ background: "var(--bg-card)" }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#6c63ff,#a78bfa)" }}
            >
              {state.user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {state.user.name}
              </p>
              <p className="text-[10px] truncate capitalize" style={{ color: "var(--text-muted)" }}>
                {state.user.role}
              </p>
            </div>
          </motion.div>
        )}

        <button
          id="logout-btn"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-red-500/10 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-red-400 transition-colors" style={{ color: "var(--text-secondary)" }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap group-hover:text-red-400 transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                Đăng xuất
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function AdminHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { state } = useAuth();
  const pathname = usePathname();

  const pageTitle = navGroups
    .flatMap((g) => g.items)
    .find((i) => i.href === pathname)?.label ?? "Dashboard";

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 flex-shrink-0 sticky top-0 z-20"
      style={{
        background: "rgba(10,10,15,0.8)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
      }}
    >
      <button
        id="mobile-menu-btn"
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {pageTitle}
      </h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          <Search className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          <input
            id="admin-search"
            type="text"
            placeholder="Tìm kiếm..."
            className="text-sm outline-none bg-transparent w-40"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* Notification bell */}
        <button
          id="notification-btn"
          className="relative p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-card)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)" }}
          title={state.user?.name}
        >
          {state.user?.name?.charAt(0) ?? "A"}
        </div>
      </div>
    </header>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);
  const toggleMobile = useCallback(() => setMobileSidebarOpen((v) => !v), []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 lg:hidden"
              style={{ background: "rgba(0,0,0,0.6)" }}
              onClick={toggleMobile}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ ease: "easeInOut", duration: 0.25 }}
              className="fixed left-0 top-0 z-40 lg:hidden"
            >
              <Sidebar collapsed={false} onToggle={toggleMobile} />
            </motion.div>
            <button
              className="fixed top-3 right-3 z-50 p-2 rounded-xl lg:hidden"
              style={{ background: "var(--bg-card)", color: "var(--text-primary)" }}
              onClick={toggleMobile}
            >
              <X className="w-5 h-5" />
            </button>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMenuToggle={toggleMobile} />
        <main
          className="flex-1 overflow-y-auto p-6 scrollbar-thin"
          style={{ background: "var(--bg-primary)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

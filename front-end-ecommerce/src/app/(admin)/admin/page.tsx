"use client";

import { motion } from "framer-motion";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  time: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats: StatCardProps[] = [
  { title: "Tổng doanh thu", value: "₫ 248.5M", change: 12.5, icon: DollarSign, color: "#6c63ff", delay: 0 },
  { title: "Đơn hàng mới", value: "1,284", change: 8.2, icon: ShoppingCart, color: "#10b981", delay: 0.05 },
  { title: "Sản phẩm", value: "3,456", change: -2.1, icon: Package, color: "#f59e0b", delay: 0.1 },
  { title: "Khách hàng", value: "12,890", change: 18.7, icon: Users, color: "#ec4899", delay: 0.15 },
];

const recentOrders: RecentOrder[] = [
  { id: "#ORD-2891", customer: "Nguyễn Văn An", product: "iPhone 15 Pro Max", amount: "₫ 31.99M", status: "delivered", time: "2 phút trước" },
  { id: "#ORD-2890", customer: "Trần Thị Bình", product: "MacBook Air M3", amount: "₫ 28.5M", status: "shipped", time: "15 phút trước" },
  { id: "#ORD-2889", customer: "Lê Quang Cường", product: "AirPods Pro 2", amount: "₫ 6.2M", status: "processing", time: "42 phút trước" },
  { id: "#ORD-2888", customer: "Phạm Thị Dung", product: "iPad Pro M4", amount: "₫ 22.1M", status: "pending", time: "1 giờ trước" },
  { id: "#ORD-2887", customer: "Hoàng Minh Đức", product: "Apple Watch Ultra 2", amount: "₫ 19.5M", status: "delivered", time: "2 giờ trước" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

const statusConfig = {
  pending: { label: "Chờ xử lý", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: Clock },
  processing: { label: "Đang xử lý", color: "#6c63ff", bg: "rgba(108,99,255,0.1)", icon: AlertCircle },
  shipped: { label: "Đang giao", color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: Truck },
  delivered: { label: "Đã giao", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: CheckCircle2 },
};

// ─── Stat Card Component ─────────────────────────────────────────────────────

function StatCard({ title, value, change, icon: Icon, color, delay = 0 }: StatCardProps) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="rounded-2xl p-5"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm mb-0.5" style={{ color: "var(--text-muted)" }}>{title}</p>
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
        </div>
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="w-4 h-4" style={{ color: "var(--success)" }} />
        ) : (
          <TrendingDown className="w-4 h-4" style={{ color: "var(--danger)" }} />
        )}
        <span
          className="text-sm font-semibold"
          style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}
        >
          {isPositive ? "+" : ""}{change}%
        </span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>so với tháng trước</span>
      </div>
    </motion.div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Chào mừng trở lại 👋
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Đây là tổng quan hoạt động hôm nay của cửa hàng bạn.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Recent Orders table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Đơn hàng gần đây
          </h3>
          <button
            id="view-all-orders-btn"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            Xem tất cả <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Mã đơn", "Khách hàng", "Sản phẩm", "Số tiền", "Trạng thái", "Thời gian"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => {
                const cfg = statusConfig[order.status];
                const StatusIcon = cfg.icon;
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="transition-colors hover:bg-[var(--bg-card-hover)]"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium" style={{ color: "var(--accent)" }}>
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {order.customer}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {order.product}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {order.amount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {order.time}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

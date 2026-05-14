"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// ─── Zod Validation Schema ────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Floating particle animation ──────────────────────────────────────────────

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${80 + i * 40}px`,
            height: `${80 + i * 40}px`,
            background: `radial-gradient(circle, rgba(108,99,255,${0.08 - i * 0.01}) 0%, transparent 70%)`,
            left: `${10 + i * 15}%`,
            top: `${5 + i * 12}%`,
            filter: "blur(20px)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { state, login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePassword = useCallback(() => setShowPassword((prev) => !prev), []);

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      router.push("/admin");
    }
  };

  const isPending = isSubmitting || state.isLoading;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background orbs */}
      <FloatingOrbs />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md mx-4"
      >
        <div
          className="glass-strong rounded-2xl p-8 shadow-2xl"
          style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(108,99,255,0.15)" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 glow-accent"
              style={{ background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)" }}
            >
              <ShoppingBag className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold gradient-text mb-1"
            >
              ShopAdmin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ color: "var(--text-secondary)" }}
              className="text-sm"
            >
              Đăng nhập vào hệ thống quản trị
            </motion.p>
          </div>

          {/* Demo credentials hint */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6 rounded-xl p-3"
            style={{
              background: "rgba(108,99,255,0.08)",
              border: "1px solid rgba(108,99,255,0.2)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--accent)" }} className="font-semibold">Demo: </span>
              admin@shop.com / admin123
            </p>
          </motion.div>

          {/* Form */}
          <form id="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4"
            >
              <label
                htmlFor="login-email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@shop.com"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#1e1e2a",
                    border: errors.email
                      ? "1px solid #ef4444"
                      : "1px solid #2a2a3a",
                    color: "#f0f0ff",
                    caretColor: "#f0f0ff",
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.currentTarget.style.border = "1px solid #6c63ff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.15)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      e.currentTarget.style.border = "1px solid #2a2a3a";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                />
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1.5 text-xs flex items-center gap-1"
                    style={{ color: "var(--danger)" }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="mb-5"
            >
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Mật khẩu
                </label>
                <button
                  type="button"
                  id="forgot-password-link"
                  className="text-xs transition-colors hover:underline"
                  style={{ color: "var(--accent)" }}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#1e1e2a",
                    border: errors.password
                      ? "1px solid #ef4444"
                      : "1px solid #2a2a3a",
                    color: "#f0f0ff",
                    caretColor: "#f0f0ff",
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.currentTarget.style.border = "1px solid #6c63ff";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(108,99,255,0.15)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password) {
                      e.currentTarget.style.border = "1px solid #2a2a3a";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-1.5 text-xs flex items-center gap-1"
                    style={{ color: "var(--danger)" }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember Me */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <input
                id="remember-me"
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded accent-[#6c63ff]"
              />
              <label
                htmlFor="remember-me"
                className="text-sm select-none cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                Ghi nhớ đăng nhập
              </label>
            </motion.div>

            {/* Server error */}
            <AnimatePresence>
              {state.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="mb-4 rounded-xl p-3 flex items-center gap-2"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                  }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "var(--danger)" }} />
                  <p className="text-sm" style={{ color: "var(--danger)" }}>
                    {state.error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              id="login-submit-btn"
              type="submit"
              disabled={isPending}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              whileHover={{ scale: isPending ? 1 : 1.02 }}
              whileTap={{ scale: isPending ? 1 : 0.98 }}
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{
                background: isPending
                  ? "rgba(108,99,255,0.5)"
                  : "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)",
                boxShadow: isPending ? "none" : "0 4px 20px rgba(108,99,255,0.4)",
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="text-center text-xs mt-6"
            style={{ color: "var(--text-muted)" }}
          >
            © 2026 ShopAdmin. Bảo mật SSL được mã hóa.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

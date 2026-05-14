import { redirect } from "next/navigation";

// Root route redirects to login — the admin layout will handle auth guard
export default function HomePage() {
  redirect("/login");
}

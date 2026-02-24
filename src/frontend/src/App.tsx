import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "./pages/HomePage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminArticleForm } from "./pages/AdminArticleForm";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const articleDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/article/$id",
  component: ArticleDetailPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const adminCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/create",
  component: AdminArticleForm,
});

const adminEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/edit/$id",
  component: AdminArticleForm,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  articleDetailRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminCreateRoute,
  adminEditRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

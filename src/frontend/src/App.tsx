import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import { CursorGlow } from "./components/CursorGlow";
import { Footer } from "./components/Footer";
import { IntroScreen } from "./components/IntroScreen";
import { Navbar } from "./components/Navbar";
import { ParticleBackground } from "./components/ParticleBackground";
import { ThemeProvider } from "./context/ThemeContext";
import AdminPanel from "./pages/AdminPanel";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogPage from "./pages/BlogPage";
import HomePage from "./pages/HomePage";
import PlayerPage from "./pages/PlayerPage";
import RacketDetailPage from "./pages/RacketDetailPage";
import RacketsPage from "./pages/RacketsPage";

function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const routerState = useRouterState();
  const isIntro = routerState.location.pathname === "/";
  return (
    <>
      <CursorGlow />
      {!isIntro && <ParticleBackground />}
      {!isIntro && <Navbar />}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Outlet />
        {!isIntro && <Footer />}
      </div>
      <Toaster />
    </>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const introRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IntroScreen,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: HomePage,
});

const playerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/player",
  component: PlayerPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});

const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogDetailPage,
});

const racketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rackets",
  component: RacketsPage,
});

const racketDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rackets/$id",
  component: RacketDetailPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});

const routeTree = rootRoute.addChildren([
  introRoute,
  homeRoute,
  playerRoute,
  blogRoute,
  blogDetailRoute,
  racketsRoute,
  racketDetailRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

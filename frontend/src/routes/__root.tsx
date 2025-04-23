import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import type { OpenGraphProtocolType } from "@/staticDataRouteOption";

import { Header } from "@/components/Header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
  staticData: {
    // RootRouteのOGP情報は使用しないが型定義上何かしら入れる必要がある
    openGraph: {
      title: "Don't Care",
      type: "Don't Care" as OpenGraphProtocolType,
      description: "Don't Care",
    },
  },
});

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

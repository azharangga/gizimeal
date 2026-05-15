import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/predict")({
  component: () => <Outlet />,
});
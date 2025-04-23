import { Button } from "@mantine/core";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

export function Login() {
  return (
    <>
      <p>Login Page</p>
      <Link to="/">
        <Button>Top</Button>
      </Link>
    </>
  );
}

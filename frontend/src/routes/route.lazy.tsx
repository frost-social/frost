import { Button, Group } from "@mantine/core";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { MrhcInput } from "./-components/MrhcInput";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

function Home() {

  return (
    <>
      <MrhcInput />
      <Group justify="center" mt="lg">
        <Button component={Link} to="/login">
          LOGIN
        </Button>
      </Group>
    </>
  );
}

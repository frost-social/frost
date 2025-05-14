import { Group, Input, Stack, Text } from "@mantine/core";
import { Suspense, useDeferredValue, useState } from "react";
import { usePostEcho } from "../-hooks/usePostEcho";

export const MrhcInput = () => {
  const [rawText, setRawText] = useState("mrhc");
  const deferredRawText = useDeferredValue(rawText);

  const { data } = usePostEcho(deferredRawText);

  return (
    <Group justify="center" p="lg">
      <Stack>
        <Input
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
          }}
        />
        <Suspense fallback={"loading..."}>
          <Text>{data.message.toUpperCase()}</Text>
        </Suspense>
      </Stack>
    </Group>
  );
};

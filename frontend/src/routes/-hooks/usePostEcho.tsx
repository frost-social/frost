import { postFetcher } from "@/utils/fetcher";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

const endpoint = "echo";

type PostEchoResponse = { message: string };

const postEchoQueryOptions = (message: string) =>
  queryOptions<PostEchoResponse | Error>({
    queryKey: [endpoint, message],
    queryFn: postFetcher(endpoint, { message }),
    enabled: !!message,
  });

export const usePostEcho = (message: string) => {
  const { data, isLoading, error, refetch } =
    useSuspenseQuery<PostEchoResponse>(postEchoQueryOptions(message));

  return { data, isLoading, error, refetch };
};

import { getApiUrl } from "./getApiUrl";
import { getObject, postObject } from "./getFetchObject";

export const postFetcher =
  (endpoint: string, obj: Record<string, unknown> = {}) =>
  async () => {
    const res = await fetch(getApiUrl(endpoint), postObject(obj));
    return await res.json();
  };

// TODO: Record<string, string>を受け取ってクエリパラメータに詰めるようにしてもいいかも
export const getFetcher = (endpoint: string) => async () => {
  const res = await fetch(getApiUrl(endpoint), getObject());
  return await res.json();
};

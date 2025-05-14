export const postObject = <T = undefined | Record<string, unknown>>(
  obj: T,
) => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    ...obj,
  }),
});

export const getObject = () => ({
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});

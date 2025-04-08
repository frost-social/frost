export type MNode = MFile;

export type MFile = {
  openapi: string,
  paths: Record<string, MPath>,
};

export type MPath = {
};

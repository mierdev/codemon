import serverless from "serverless-http";

const serverModule = await import("../../server.js");

export const handler = serverless(serverModule.app);
